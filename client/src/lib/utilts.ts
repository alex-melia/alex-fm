import { ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date) {
  const day = date.toLocaleDateString(undefined, { weekday: "long" }) // e.g., "Saturday"
  const dayOfMonth = date.getDate() // e.g., 7
  const month = date.toLocaleDateString(undefined, { month: "long" }) // e.g., "December"
  const time = date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }) // e.g., "17:00:00"

  // Determine suffix for the day
  const suffix =
    dayOfMonth % 10 === 1 && dayOfMonth !== 11
      ? "st"
      : dayOfMonth % 10 === 2 && dayOfMonth !== 12
      ? "nd"
      : dayOfMonth % 10 === 3 && dayOfMonth !== 13
      ? "rd"
      : "th"

  return `${day} ${dayOfMonth}${suffix} ${month}, ${time}`
}

export function getRelativeTime(playedAt: string): string {
  const now = new Date()
  const playedDate = new Date(playedAt)
  const diffMs = now.getTime() - playedDate.getTime()

  const diffSeconds = Math.floor(diffMs / 1000)
  const diffMinutes = Math.floor(diffSeconds / 60)
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffDays > 0) {
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`
  } else if (diffHours > 0) {
    return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`
  } else if (diffMinutes > 0) {
    return `${diffMinutes} minute${diffMinutes > 3 ? "s" : ""} ago`
  } else {
    return "just now"
  }
}

export const SERVER_URL =
  process.env.NODE_ENV === "production"
    ? process.env.BACKEND_URL
    : process.env.DEV_BACKEND_URL
