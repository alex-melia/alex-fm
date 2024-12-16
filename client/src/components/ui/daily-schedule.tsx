import React from "react"
import { Schedule } from "@/types/types"
import { PlusIcon } from "lucide-react"
import { cn } from "@/lib/utilts"

export default function DailySchedule({
  day,
  schedules,
  onAdd,
  onEdit,
}: {
  day: any
  schedules: Schedule[]
  onAdd: (day: Date) => void
  onEdit: (schedule: Schedule) => void
}) {
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [itemsPerPage, setItemsPerPage] = React.useState(4)

  React.useEffect(() => {
    const updateItemsPerPage = () => {
      if (window.innerWidth >= 1024) {
        setItemsPerPage(4)
      } else if (window.innerWidth >= 768) {
        setItemsPerPage(3)
      } else {
        setItemsPerPage(1)
      }
    }

    updateItemsPerPage()

    window.addEventListener("resize", updateItemsPerPage)

    return () => {
      window.removeEventListener("resize", updateItemsPerPage)
    }
  }, [])

  const totalPages = Math.ceil(schedules.length / itemsPerPage)

  const handleNext = () => {
    if (currentIndex < totalPages - 1) {
      setCurrentIndex((prev) => prev + 1)
    }
  }

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1)
    }
  }

  const visibleSchedules = schedules.slice(
    currentIndex * itemsPerPage,
    (currentIndex + 1) * itemsPerPage
  )

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
      <div
        className={cn(
          schedules.length ? "relative flex" : "hidden",
          "items-center w-full"
        )}
      >
        <button
          className="absolute left-0 bg-white dark:bg-neutral-800 p-2 rounded-full shadow-lg z-10"
          onClick={handlePrev}
          disabled={currentIndex === 0}
        >
          &#9664;
        </button>

        <div className="flex overflow-x-hidden gap-4 w-full px-8">
          {visibleSchedules.map((schedule: Schedule, index: number) => {
            const startTime = new Date(schedule.startTime)
            const endTime = new Date(
              startTime.getTime() + schedule.duration * 60 * 1000
            )

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
        <button
          className="absolute right-0 bg-white dark:bg-neutral-800 p-2 rounded-full shadow-lg z-10"
          onClick={handleNext}
          disabled={currentIndex === totalPages - 1}
        >
          &#9654;
        </button>
      </div>
    </div>
  )
}
