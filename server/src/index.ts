import express from "express"
import dotenv from "dotenv"
import ffmpeg from "fluent-ffmpeg"
import schedule from "node-schedule"
import { Readable, Transform } from "stream"
import fetch from "node-fetch"
import cors from "cors"
import { Server } from "socket.io"
import http from "http"
import { prisma } from "./lib/db"
const app = express()

const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: "https://radio.alexmelia.dev",
    methods: ["GET", "POST"],
  },
})

// Routes
import { songRoutes } from "./routes/song"
import { playlistRoutes } from "./routes/playlist"
import { recentlyPlayedRoutes } from "./routes/recently-played"
import { scheduleRoutes } from "./routes/schedule"
import { testRoutes } from "./routes/test"
import { authRoutes } from "./routes/auth"

dotenv.config({ path: "./.env" })

const ICECAST_URL =
  process.env.NODE_ENV === "production"
    ? "icecast://source:alexfm@178.156.137.38:8443/stream"
    : "icecast://source:alexfm@localhost:8443/stream"

ffmpeg.setFfmpegPath(
  process.env.NODE_ENV === "production"
    ? "/usr/bin/ffmpeg"
    : "C:\\ffmpeg-2024-12-04-git-2f95bc3cb3-full_build\\bin\\ffmpeg.exe"
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
let currentMetadata: any = null
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

  audioStream.setMaxListeners(50)

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
    })
    .on("end", () => {
      console.log("FFmpeg streaming ended.")
    })

  ffmpegProcess.run()
}

async function streamSongs() {
  resetAudioStream()

  while (true) {
    if (songQueue.length === 0) {
      console.log("No songs in the queue. Icecast will serve silence.mp3...")
      await new Promise((resolve) => setTimeout(resolve, 10000))
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

    const startTime = Date.now()
    await streamSongToAudioStream(song.mp3Url)

    const elapsedTime = Date.now() - startTime
    const songDurationInMs = (song.duration || 0) * 1000
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
    } catch (error: any) {
      console.error("Error writing to database:", error.message)
    }
  }
}

async function fetchWithRetry(
  url: string,
  options = {},
  retries = 3,
  delay = 1000
) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options)
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`)
      return response
    } catch (error: any) {
      console.error(`Fetch attempt ${i + 1} failed: ${error.message}`)
      if (i < retries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay * (i + 1)))
      } else {
        throw error
      }
    }
  }
}

async function streamSongToAudioStream(songUrl: string) {
  if (!audioStream) {
    console.error("Audio stream is not initialized.")
    resetAudioStream()
  }

  return new Promise<void>((resolve, reject) => {
    fetchWithRetry(songUrl)
      .then((res: any) => {
        if (!res.body) {
          reject(new Error("Failed to fetch song stream."))
          return
        }

        const realTimePacer = new Transform({
          transform(chunk, encoding, callback) {
            setTimeout(() => {
              callback(null, chunk)
            }, 100)
          },
        })

        res.body
          .pipe(realTimePacer)
          .on("data", (chunk: any) => {
            if (!audioStream?.push(chunk)) {
              console.log("chunk not pushed")

              res.body.pause()
              console.log("paused")
              audioStream?.once("drain", () => res.body.resume())
              console.log("drained")
            }
            console.log(chunk)
          })
          .on("end", () => {
            console.log("Finished streaming song.")
            resolve()
          })
          .on("error", (err: any) => {
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

async function initializeSchedule() {
  const today = new Date()
  today.setUTCHours(0, 0, 0, 0)

  const tomorrow = new Date(today)
  tomorrow.setUTCDate(today.getUTCDate() + 1)

  const schedules = await prisma.schedule.findMany({
    where: {
      startTime: {
        gte: today.toISOString(),
        lt: tomorrow.toISOString(),
      },
    },
    include: { playlist: { include: { songs: true } } },
  })

  schedules.forEach((scheduleItem) => {
    const startTime = new Date(scheduleItem.startTime)

    schedule.scheduleJob(new Date(startTime.getTime() + 1000), async () => {
      console.log(`Starting playlist: ${scheduleItem.playlist.name}`)
      try {
        const songs = await fetchSongs(scheduleItem.playlist.id)

        const processedSongs = songs.map((song) => ({
          ...song,
          image: song.image || "",
          album: song.album || "",
        }))
        songQueue.push(...processedSongs)
        resetAudioStream()
      } catch (error: any) {
        console.error("Error initializing playlist:", error.message)
      }
    })
  })
}

;(async () => {
  await initializeSchedule()

  schedule.scheduleJob("0 0 * * *", async () => {
    console.log("Initializing schedule...")
    await initializeSchedule()
  })

  streamSongs()
})()

io.on("connection", (socket) => {
  socket.emit("metadataUpdate", currentMetadata)
})

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? "https://radio.alexmelia.dev"
        : "*",
  })
)
app.use(express.json())

app.use("/api/songs", songRoutes)
app.use("/api/playlists", playlistRoutes)
app.use("/api/recently-played", recentlyPlayedRoutes)
app.use("/api/schedules", scheduleRoutes)
app.use("/api/auth", authRoutes)
app.use("/api", testRoutes)

server.listen(8001, () => {
  console.log("Listening on port 8001")
})
