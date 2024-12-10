export type Song = {
  id: string
  mp3Url: string
  artist: string
  image: string
  title: string
  position: number
  playlist: Playlist
  duration: number
}

export type Schedule = {
  id: string
  startTime: Date
  duration: number
  playlistId: string
  playlist: Playlist
}

export type Playlist = {
  id: string
  name: string
  description: string
  genre: string
  songs: Song[]
  startDate: string
}

export type RecentlyPlayed = {
  id: string
  playedAt: string
  song: Song
  songId: string
}
