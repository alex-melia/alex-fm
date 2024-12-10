// import React, { FormEvent, useState } from "react"

// export default function AddTrackForm() {
//   const [trackName, setTrackName] = useState("")
//   const [artist, setArtist] = useState("")
//   const [file, setFile] = useState(null)

//   const handleSubmit = (event: FormEvent) => {
//     event.preventDefault()

//     if (!file) {
//       alert("Please upload an MP3 file.")
//       return
//     }

//     const formData = new FormData()
//     formData.append("trackName", trackName)
//     formData.append("artist", artist)
//     formData.append("file", file)

//     fetch("/api/tracks", {
//       method: "POST",
//       body: formData,
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         console.log("Track uploaded successfully:", data)
//         alert("Track added successfully!")
//       })
//       .catch((error) => {
//         console.error("Error uploading track:", error)
//         alert("Failed to add track.")
//       })
//   }

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="flex flex-col gap-4 max-w-md mx-auto p-4 border rounded shadow"
//     >
//       <label className="flex flex-col gap-2">
//         Track Name:
//         <input
//           type="text"
//           value={trackName}
//           onChange={(e) => setTrackName(e.target.value)}
//           placeholder="Enter track name"
//           className="border p-2 rounded"
//           required
//         />
//       </label>
//       <label className="flex flex-col gap-2">
//         Artist:
//         <input
//           type="text"
//           value={artist}
//           onChange={(e) => setArtist(e.target.value)}
//           placeholder="Enter artist name"
//           className="border p-2 rounded"
//           required
//         />
//       </label>
//       <label className="flex flex-col gap-2">
//         MP3 File:
//         <input
//           type="file"
//           accept=".mp3"
//           onChange={(e) => setFile((e) => e.target.files[0])}
//           className="border p-2 rounded"
//           required
//         />
//       </label>
//       <button
//         type="submit"
//         className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
//       >
//         Add Track
//       </button>
//     </form>
//   )
// }
