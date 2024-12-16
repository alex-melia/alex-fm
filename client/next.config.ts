import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  /* config options here */
}

// const nextConfig: NextConfig = {
//   async redirects() {
//     return [
//       {
//         source: "/admin",
//         has: [
//           {
//             type: "cookie",
//             key: "token", // Check for the existence of the token cookie
//           },
//         ],
//         destination: "/admin", // Allow access to /admin if the token exists
//         permanent: false,
//       },
//       {
//         source: "/admin",
//         destination: "/login", // Redirect to login if the token is missing
//         permanent: false,
//       },
//     ]
//   },
// }

export default nextConfig
