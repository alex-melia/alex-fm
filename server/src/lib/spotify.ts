import { SpotifyApi } from "@spotify/web-api-ts-sdk"

export const spotify = SpotifyApi.withClientCredentials(
  "5bb28a5e9b3b4a13bc0da3dc66a0bb66",
  "1d4c88d822094703b7ddbd3ee8a82f33"
)
