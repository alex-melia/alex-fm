"use client"

import React from "react"
import { cn, getRelativeTime } from "@/lib/utilts"
import { RecentlyPlayed } from "@/types/types"
import { ArrowRightCircle } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function RecentlyPlayedGrid({
  recentlyPlayed,
}: {
  recentlyPlayed: RecentlyPlayed[] | null
}) {
  const pathname = usePathname()

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 grid-rows-2 gap-4 sm:gap-6 lg:gap-12 w-full">
      {pathname === "/recently-played" ? (
        recentlyPlayed && recentlyPlayed.length > 0 ? (
          recentlyPlayed
            .filter(
              (entry: RecentlyPlayed) => entry.song.title !== "Advertisement"
            )
            .map((entry: RecentlyPlayed, index: number) => (
              <div key={index} className="text-center">
                <img
                  className="mb-2 w-full"
                  src={entry.song.image ? entry.song.image : ""}
                />
                <p className="text-lg font-medium">{entry.song.title}</p>
                <p className="text-sm text-gray-500">{entry.song.artist}</p>
                <p className="text-sm text-black dark:text-gray-200 mt-2">
                  played {getRelativeTime(entry.playedAt)}
                </p>
              </div>
            ))
        ) : (
          <p className="text-gray-500">No songs played recently.</p>
        )
      ) : pathname === "/" && recentlyPlayed && recentlyPlayed.length > 0 ? (
        recentlyPlayed
          .filter(
            (entry: RecentlyPlayed) => entry.song.title !== "Advertisement"
          )
          .slice(0, 9)
          .map((entry: RecentlyPlayed, index: number) => (
            <div key={index} className="text-center">
              <img
                className="mb-2 w-full"
                src={entry.song.image ? entry.song.image : ""}
              />
              <p className="text-lg font-medium">{entry.song.title}</p>
              <p className="text-sm text-gray-500">{entry.song.artist}</p>
              <p className="text-sm text-black dark:text-gray-200 mt-2">
                played {getRelativeTime(entry.playedAt)}
              </p>
            </div>
          ))
      ) : (
        <p className="text-gray-500">No songs played recently.</p>
      )}
      <Link
        href="/recently-played"
        className={cn(
          pathname === "/recently-played" ? "hidden" : "flex",
          "text-blue-500 flex-col gap-8 items-center justify-center"
        )}
      >
        <span className="text-3xl tracking-tight">See more</span>
        <ArrowRightCircle size={64} />
      </Link>
    </div>
  )
}
