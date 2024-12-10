export type Song = {
  id: string
  mp3Url: string
  artist: string
  image: string
  title: string
  position: number
  duration: number
}

export type Schedule = {
  id: string
  startTime: Date
  playlistId: string
  playlist: Playlist
}

export type Playlist = {
  id: string
  name: string
  genre: String
  songs: Song[]
  startDate: string
}

export type RecentlyPlayed = {
  id: string
  playedAt: string
  song: Song
  songId: string
}
