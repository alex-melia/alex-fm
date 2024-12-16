"use client"

import React from "react"
import { useRouter } from "next/navigation"

export default function LoginForm() {
  const [password, setPassword] = React.useState("")
  const [error, setError] = React.useState("")
  const [isPending, startTransition] = React.useTransition()

  const router = useRouter()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    startTransition(async () => {
      try {
        const res = await fetch("https://api.alexmelia.dev/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            password: password,
          }),
        })

        if (!res.ok) {
          throw new Error("Failed to login.")
        }

        const data = await res.json()

        document.cookie = `token=${data.jwt}; path=/; max-age=3600; secure`
        router.push("/admin")
      } catch (error) {
        setError("Failed to login!")
      }
    })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col justify-center mx-auto max-w-2xl"
    >
      <h3 className="text-center text-4xl font-semibold tracking-tighter">
        Login
      </h3>
      <div className="flex flex-col my-12 space-y-2">
        <label className="font-semibold text-xl">Password</label>
        <input
          className="border rounded-md p-1"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-red-500 text-center">{error}</p>}
        <button
          disabled={isPending}
          className="text-2xl bg-black text-white mx-auto px-4 py-2 rounded-2xl dark:bg-white dark:text-black"
        >
          {isPending ? "..." : "Login"}
        </button>
      </div>
    </form>
  )
}
