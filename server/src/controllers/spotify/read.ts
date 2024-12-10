import { Request, Response } from "express"
import ffmpeg from "fluent-ffmpeg"
import path from "path"
import ytdl from "ytdl-core"

ffmpeg.setFfmpegPath(
  "C:\\ffmpeg-2024-11-28-git-bc991ca048-full_build\\bin\\ffmpeg.exe"
)

export async function getSong(req: Request, res: Response) {
  try {
    // const filePath = path.resolve(__dirname, "../../assets/deftones.mp3")
    const filePath =
      "https://cdn.freecodecamp.org/curriculum/js-music-player/scratching-the-surface.mp3"

    if (!filePath) {
      throw new Error("File not found")
    }

    const songTitle = "WAP (Local File)"

    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) {
        console.error("Error retrieving metadata:", err)
        return res.status(500).send({ error: "Failed to retrieve metadata" })
      }

      console.log("Metadata:", metadata)

      // Start streaming the song
      streamToIcecast(filePath, songTitle)

      // Send metadata to the client
      res.status(200).send({
        message: `Streaming "${songTitle}" to Icecast`,
        metadata: extractRelevantMetadata(metadata),
      })
    })

    // streamToIcecast(filePath, songTitle)

    // res.status(200).send({ message: `Streaming "${songTitle}" to Icecast` })
  } catch (error) {
    console.log(error)

    return res.status(500).send(error)
  }
}

function streamToIcecast(filePath: string, songTitle: string) {
  const icecastUrl = "icecast://source:hackme@127.0.0.1:8000/stream"
  ffmpeg(filePath)
    .inputOptions(["-re"])
    .outputOptions(["-map 0:a", "-f mp3", "-content_type audio/mpeg"])
    .output(icecastUrl)
    .on("start", () => {
      console.log(`Streaming "${songTitle}" to Icecast...`)
    })
    .on("error", (err) => {
      console.error("FFmpeg error:", err)
    })
    .on("end", () => {
      console.log(`Finished streaming "${songTitle}".`)
    })
    .run()
}

function extractRelevantMetadata(metadata: any) {
  const format = metadata.format || {}
  const stream = metadata.streams.find((s: any) => s.codec_type === "audio")

  return {
    title: format.tags?.title || "Unknown",
    artist: format.tags?.artist || "Unknown",
    album: format.tags?.album || "Unknown",
    genre: format.tags?.genre || "Unknown",
    duration: format.duration || 0, // Duration in seconds
    bitrate: format.bit_rate || "Unknown",
    sampleRate: stream?.sample_rate || "Unknown",
    channels: stream?.channels || "Unknown",
    codec: stream?.codec_name || "Unknown",
  }
}
