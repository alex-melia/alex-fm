import { Schedule } from "@/types/types"
import { PlusIcon } from "lucide-react"
import React from "react"

export default function DailySchedule({
  day,
  schedules,
  onAdd,
  onEdit,
}: {
  day: Date
  schedules: Schedule[]
  onAdd: (day: Date) => void
  onEdit: (schedule: Schedule) => void
}) {
  const hours = Array.from({ length: 24 }, (_, i) => i)

  return (
    <div className="flex flex-col p-2">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold mb-2">
          {new Date(day).toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          })}
        </h3>
        <PlusIcon className="cursor-pointer" onClick={() => onAdd(day)} />
      </div>
      <div className="flex w-full">
        <div className="flex w-full gap-4">
          {schedules.map((schedule: Schedule, index: number) => {
            const startTime = new Date(schedule.startTime)
            const endTime = new Date(
              startTime.getTime() + schedule.duration * 60 * 1000
            )
            // const startHour = startTime.getHours()
            // const startMinute = startTime.getMinutes()
            // const durationInMinutes = schedule.duration

            return (
              <div
                key={index}
                className="bg-gradient-to-b from-white to-neutral-100 dark:from-neutral-700 dark:to-neutral-900 shadow-sm border border-neutral-100 dark:border-neutral-700 p-4 rounded-md w-full"
                onClick={() => onEdit(schedule)}
              >
                <p className="text-md font-semibold tracking-tighter">
                  {startTime.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  -{" "}
                  {endTime.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <p className="text-2xl tracking-tight font-semibold mt-2">
                  {schedule.playlist.name}
                </p>
                <p className="text-md">{schedule.playlist.description}</p>
                <p className="text-md mt-4">{schedule.playlist.genre}</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
