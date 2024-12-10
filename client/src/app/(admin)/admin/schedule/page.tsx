"use client"

import AddScheduleModal from "@/components/modals/add-schedule"
import DailySchedule from "@/components/ui/daily-schedule"
import { Schedule } from "@/types/types"
import React from "react"

export default function SchedulePage() {
  const [showModal, setShowModal] = React.useState(false)
  const [editDay, setEditDay] = React.useState<Date | null>(null)
  const [weekStart, setWeekStart] = React.useState(() => {
    const now = new Date()
    const day = now.getDay()
    const diff = day === 0 ? -6 : 1 - day
    const monday = new Date(now.setDate(now.getDate() + diff))
    monday.setHours(0, 0, 0, 0)
    return monday
  })

  const [schedules, setSchedules] = React.useState<Schedule[]>([])

  React.useEffect(() => {
    const fetchData = async () => {
      const startDate = weekStart.toISOString().split("T")[0]
      const response = await fetch(
        `http://5.75.188.62:8001/api/schedules/${startDate}`
      )

      if (!response.ok) {
        console.error("Failed to fetch schedules")
        return
      }

      const data = await response.json()
      setSchedules(data)

      console.log(data)
    }

    fetchData()
  }, [weekStart])

  const days = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(weekStart)
    day.setDate(weekStart.getDate() + i)
    return day
  })

  const handleAddClick = (day: Date) => {
    setEditDay(day)
    setShowModal(true)
  }

  const handleEdit = (schedule: Schedule) => {
    console.log("Edit schedule:", schedule)
  }

  const handleAddSchedule = () => {
    window.location.reload()
  }

  return (
    <>
      <div className="w-full container mx-auto">
        <h1 className="text-2xl font-bold mb-4">Weekly Schedule</h1>
        <div className="week-controls flex justify-between mb-6">
          <button
            onClick={() =>
              setWeekStart(new Date(weekStart.setDate(weekStart.getDate() - 7)))
            }
          >
            Previous Week
          </button>
          <span>
            {weekStart.toDateString()} -{" "}
            {new Date(weekStart.getTime() + 6 * 86400000).toDateString()}
          </span>
          <button
            onClick={() =>
              setWeekStart(new Date(weekStart.setDate(weekStart.getDate() + 7)))
            }
          >
            Next Week
          </button>
        </div>

        <div className="flex flex-col justify-between w-full gap-4">
          {days.map((day) => (
            <DailySchedule
              key={day.toDateString()}
              day={day.toDateString()}
              schedules={schedules.filter(
                (schedule: Schedule) =>
                  new Date(schedule.startTime).getDate() === day.getDate()
              )}
              onAdd={() => handleAddClick(day)}
              onEdit={handleEdit}
            />
          ))}
        </div>
      </div>
      {editDay && showModal && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div
            onClick={() => {
              setShowModal(!showModal), setEditDay(null)
            }}
            className="fixed inset-0 flex items-center justify-center bg-black/80 -z-10"
          ></div>
          <AddScheduleModal day={editDay} onAddSchedule={handleAddSchedule} />
        </div>
      )}
    </>
  )
}
