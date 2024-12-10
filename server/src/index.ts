// import express from "express"
// import dotenv from "dotenv"
// import ffmpeg from "fluent-ffmpeg"
// import schedule from "node-schedule"
// // import { spotifyRouter } from "./routes/spotify"
// import { PrismaClient } from "@prisma/client"
// import { Readable, Transform } from "stream"
// import fetch from "node-fetch"
// import path from "path"
// import fs, { lchownSync } from "fs"

// dotenv.config({ path: "./.env" })

// const app = express()
// const prisma = new PrismaClient()
// const ICECAST_URL = "icecast://source:hackme@127.0.0.1:8000/stream"

// ffmpeg.setFfmpegPath(
//   "C:\\ffmpeg-2024-12-04-git-2f95bc3cb3-full_build\\bin\\ffmpeg.exe"
// )

// let songQueue: { mp3Url: string; title: string; artist: string }[] = []

// function createAudioStream() {
//   const audioStream = new Readable({
//     read() {},
//   })

//   const ffmpegProcess = ffmpeg()
//     .input(audioStream)
//     .inputOptions(["-re"])
//     .outputOptions(["-f mp3", "-content_type audio/mpeg"])
//     .output(ICECAST_URL)
//     .on("start", () => {
//       console.log("Started streaming to Icecast...")
//     })
//     .on("error", (err) => {
//       console.error("FFmpeg error:", err.message)
//     })
//     .on("end", () => {
//       console.log("FFmpeg streaming ended.")
//     })
//     .run()

//   return { audioStream, ffmpegProcess }
// }

// async function streamSongs() {
//   const { audioStream } = createAudioStream()

//   while (true) {
//     if (songQueue.length === 0) {
//       console.log("No songs in the queue. Icecast will serve silence.mp3...")
//       await new Promise((resolve) => setTimeout(resolve, 10000)) // Wait and check again
//       console.log(audioStream)
//       continue
//     }

//     const song = songQueue.shift() // Get the next song

//     if (!song) {
//       return
//     }

//     console.log(songQueue)

//     console.log(`Streaming: ${song.title} by ${song.artist}`)

//     await streamSongToAudioStream(audioStream, song.mp3Url)
//   }
// }

// async function streamSongToAudioStream(audioStream: Readable, songUrl: string) {
//   return new Promise<void>((resolve, reject) => {
//     fetch(songUrl)
//       .then((res) => {
//         if (!res.body) {
//           reject(new Error("Failed to fetch song stream."))
//           return
//         }

//         const realTimePacer = new Transform({
//           transform(chunk, encoding, callback) {
//             setTimeout(() => {
//               callback(null, chunk) // Pace the chunk processing
//             }, 10) // Adjust for desired bitrate pacing
//           },
//         })

//         res.body
//           .pipe(realTimePacer) // Pace data before pushing to audioStream
//           .on("data", (chunk) => audioStream.push(chunk)) // Push data to the readable stream
//           .on("end", () => {
//             console.log("Finished streaming song.")
//             resolve()
//           })
//           .on("error", (err) => {
//             console.error("Error while streaming song:", err.message)
//             reject(err)
//           })
//       })
//       .catch((err) => {
//         console.error("Error fetching song:", err.message)
//         reject(err)
//       })
//   })
// }

// async function fetchSongs(playlistId: string) {
//   const playlist = await prisma.playlist.findUnique({
//     where: { id: playlistId },
//     include: { songs: { orderBy: { position: "asc" } } },
//   })

//   if (!playlist || !playlist.songs.length) {
//     throw new Error("No songs found in the playlist.")
//   }

//   return playlist.songs.map((song) => ({
//     mp3Url: song.mp3Url,
//     title: song.title,
//     artist: song.artist,
//   }))
// }

// async function scheduleSongs() {
//   const schedules = await prisma.schedule.findMany({
//     include: { playlist: { include: { songs: true } } },
//   })

//   schedules.forEach((scheduleItem) => {
//     const { startTime, playlist } = scheduleItem

//     const [hour, minute] = [
//       new Date(startTime).getHours(),
//       new Date(startTime).getMinutes(),
//     ]

//     schedule.scheduleJob({ hour, minute, tz: "UTC" }, async () => {
//       console.log(`Starting playlist: ${playlist.name}`)
//       try {
//         const songs = await fetchSongs(playlist.id) // Fetch songs for the playlist
//         songQueue.push(...songs) // Add songs to the global queue
//       } catch (err: any) {
//         console.error(
//           `Error fetching songs for playlist ${playlist.name}:`,
//           err.message
//         )
//       }
//     })
//   })
// }

// scheduleSongs()
//   .then(() => {
//     console.log("Daily schedules initialized.")
//     streamSongs()
//   })
//   .catch((err) => console.error("Error initializing schedules:", err))

// app.listen(8001, () => {
//   console.log("Listening on port 8001")
// })

// @ts-nocheck
import express from "express"
import dotenv from "dotenv"
import ffmpeg from "fluent-ffmpeg"
import schedule from "node-schedule"
// import { PrismaClient } from "@prisma/client"
import { Readable, Transform } from "stream"
import fetch from "node-fetch"
import cors from "cors"
// import { createServer } from "http"
import { Server } from "socket.io"
import http from "http"
import { prisma } from "./lib/db"
const app = express()

const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Replace with your frontend URL
    methods: ["GET", "POST"],
  },
})

io.on("connection", (socket) => {
  console.log("a user connected")
})

// Routes
import { songRoutes } from "./routes/song"
import { playlistRoutes } from "./routes/playlist"
import { recentlyPlayedRoutes } from "./routes/recently-played"
import { scheduleRoutes } from "./routes/schedule"

dotenv.config({ path: "./.env" })

// const prisma = new PrismaClient()
const ICECAST_URL = "icecast://source:hackme@127.0.0.1:8000/stream"

ffmpeg.setFfmpegPath(
  "C:\\ffmpeg-2024-12-04-git-2f95bc3cb3-full_build\\bin\\ffmpeg.exe"
)

let songQueue: {
  id: string
  mp3Url: string
  title: string
  image: string
  artist: string
  duration: number
  album: string
  playlist: object
}[] = []
let currentMetadata = null
let audioStream: Readable | null = null
let ffmpegProcess: ffmpeg.FfmpegCommand | null = null

function resetAudioStream() {
  if (audioStream) {
    audioStream.destroy()
  }
  if (ffmpegProcess) {
    ffmpegProcess.kill("SIGKILL")
  }

  audioStream = new Readable({
    read() {},
  })

  ffmpegProcess = ffmpeg()
    .input(audioStream)
    .inputOptions(["-re"])
    .outputOptions(["-f mp3", "-content_type audio/mpeg"])
    .output(ICECAST_URL)
    .on("start", () => {
      console.log("Started streaming to Icecast...")
    })
    .on("error", (err) => {
      console.error("FFmpeg error:", err.message)
      // setTimeout(resetAudioStream, 2000)
    })
    .on("end", () => {
      console.log("FFmpeg streaming ended.")
    })
    .run()
}

// async function streamSongs() {
//   resetAudioStream()

//   while (true) {
//     if (songQueue.length === 0) {
//       console.log("No songs in the queue. Icecast will serve silence.mp3...")
//       await new Promise((resolve) => setTimeout(resolve, 10000)) // Wait and check again
//       continue
//     }

//     const song = songQueue.shift()
//     if (!song) continue

//     console.log(`Streaming: ${song.title} by ${song.artist}`)

//     io.emit("metadataUpdate", song)

//     await streamSongToAudioStream(song.mp3Url)
//   }
// }

async function streamSongs() {
  resetAudioStream()

  while (true) {
    if (songQueue.length === 0) {
      console.log("No songs in the queue. Icecast will serve silence.mp3...")
      await new Promise((resolve) => setTimeout(resolve, 10000)) // Wait and check again
      continue
    }

    const song = songQueue.shift()
    if (!song) continue

    console.log(`Streaming: ${song.title} by ${song.artist}`)

    currentMetadata = {
      title: song.title,
      artist: song.artist,
      image: song.image,
      album: song.album,
      playlist: song.playlist,
    }
    io.emit("metadataUpdate", currentMetadata)

    // Stream the song
    const startTime = Date.now()
    await streamSongToAudioStream(song.mp3Url)

    // Wait for the duration of the song to pass
    const elapsedTime = Date.now() - startTime
    const songDurationInMs = (song.duration || 0) * 1000 // Assuming duration is in seconds
    if (elapsedTime < songDurationInMs) {
      await new Promise((resolve) =>
        setTimeout(resolve, songDurationInMs - elapsedTime)
      )
    }

    try {
      await prisma.recentlyPlayed.create({
        data: {
          songId: song.id,
        },
      })
    } catch (error) {
      console.error("Error writing to database:", error.message)
    }
  }
}

async function streamSongToAudioStream(songUrl: string) {
  if (!audioStream) {
    console.error("Audio stream is not initialized.")
    resetAudioStream()
  }

  return new Promise<void>((resolve, reject) => {
    fetch(songUrl)
      .then((res) => {
        if (!res.body) {
          reject(new Error("Failed to fetch song stream."))
          return
        }

        const realTimePacer = new Transform({
          transform(chunk, encoding, callback) {
            setTimeout(() => {
              callback(null, chunk) // Pace the chunk processing
            }, 10) // Adjust for desired bitrate pacing
          },
        })

        res.body
          .pipe(realTimePacer)
          .on("data", (chunk) => {
            if (!audioStream?.push(chunk)) {
              res.body.pause() // Pause fetching data if backpressure occurs
              audioStream.once("drain", () => res.body.resume()) // Resume when drain is triggered
            }
          })
          .on("end", () => {
            console.log("Finished streaming song.")
            resolve()
          })
          .on("error", (err) => {
            console.error("Error while streaming song:", err.message)
            reject(err)
          })
      })
      .catch((err) => {
        console.error("Error fetching song:", err.message)
        reject(err)
      })
  })
}

//   res.body
//     .pipe(realTimePacer)
//     .on("data", (chunk) => {
//       const canPush = audioStream?.push(chunk)
//       if (!canPush) {
//         audioStream?.once("drain", () => audioStream?.push(chunk))
//       }
//     })
//     .on("end", () => {
//       console.log("Finished streaming song.")
//       resolve()
//     })
//     .on("error", (err) => {
//       console.error("Error while streaming song:", err.message)
//       reject(err)
//     })
// })

async function fetchSongs(playlistId: string) {
  const playlist = await prisma.playlist.findUnique({
    where: { id: playlistId },
    include: { songs: { orderBy: { position: "asc" } } },
  })

  if (!playlist || !playlist.songs.length) {
    throw new Error("No songs found in the playlist.")
  }

  const playlistObj = {
    name: playlist.name,
    description: playlist.description,
  }

  return playlist.songs.map((song) => ({
    id: song.id,
    mp3Url: song.mp3Url,
    title: song.title,
    image: song.image,
    artist: song.artist,
    album: song.album,
    playlist: playlistObj,
    duration: song.duration,
  }))
}

async function scheduleSongs() {
  const schedules = await prisma.schedule.findMany({
    include: { playlist: { include: { songs: true } } },
  })

  schedules.forEach((scheduleItem) => {
    const { startTime, playlist } = scheduleItem

    const [hour, minute] = [
      new Date(startTime).getHours(),
      new Date(startTime).getMinutes(),
    ]

    schedule.scheduleJob({ hour, minute, tz: "UTC" }, async () => {
      console.log(`Starting playlist: ${playlist.name}`)
      try {
        const songs = await fetchSongs(playlist.id)
        songQueue.push(...songs)
        resetAudioStream()
      } catch (err: any) {
        console.error(
          `Error fetching songs for playlist ${playlist.name}:`,
          err.message
        )
      }
    })
  })
}

// async function initializeSchedule() {
//   const today = new Date();
//   today.setHours(0, 0, 0, 0);
//   const tomorrow = new Date(today);
//   tomorrow.setDate(today.getDate() + 1);

//   const todaySchedule = await prisma.schedule.findMany({
//     where: {
//       startDate: {
//         gte: today,
//         lt: tomorrow,
//       },
//     },
//     include: { playlist: { include: { songs: true } } },
//   });

//   todaySchedule.forEach((item) => {
//     schedule.scheduleJob(item.startDate, () => {
//       console.log(`Starting playlist: ${item.playlist.name}`);
//       // Initialize the playlist streaming logic here
//     });
//   });
// }

// schedule.scheduleJob("0 0 * * *", initializeSchedule);

io.on("connection", (socket) => {
  console.log("A user connected")
  console.log(currentMetadata)

  socket.emit("metadataUpdate", currentMetadata)
})

scheduleSongs()
  .then(() => {
    console.log("Daily schedules initialized.")

    streamSongs()
  })
  .catch((err) => console.error("Error initializing schedules:", err))

app.use(
  cors({
    origin: "*",
  })
)
app.use(express.json())

app.use("/api/songs", songRoutes)
app.use("/api/playlists", playlistRoutes)
app.use("/api/recently-played", recentlyPlayedRoutes)
app.use("/api/schedules", scheduleRoutes)

server.listen(8001, () => {
  console.log("Listening on port 8001")
})
