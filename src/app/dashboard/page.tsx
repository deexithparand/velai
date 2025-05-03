"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { z } from "zod"

import { CreateTaskDialog } from "@/components/create-task-dialog"
import { columns } from "./components/columns"
import { DataTable } from "./components/data-table"
import { UserNav } from "./components/user-nav"
import { taskSchema } from "./data/schema"

export default function TaskPage() {
  type Task = z.infer<typeof taskSchema>

  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function fetchTasks() {
      try {

        const email = localStorage.getItem("userEmail")
        if (!email) {
          console.log("No email found in localStorage")
          router.push("/login")
          return
        }

        console.log("Email retrieved : ",email)

        const token = localStorage.getItem("token")
        if (!email) {
          console.log("No token found")
          router.push("/login")
          return
        }

        const res = await fetch("https://velai-go.onrender.com/api/tasks", {
          method: "POST", // assuming you accept email via POST body
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ email }),
        })

        if (!res.ok) throw new Error("Failed to fetch tasks")

        const data = await res.json()
        const parsed = z.array(taskSchema).parse(data)
        setTasks(parsed)
      } catch (err) {
        console.error("Error fetching tasks:", err)
        setTasks([])
      } finally {
        setLoading(false)
      }
    }

    fetchTasks()
  }, [router, tasks])

  return (
    <>
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
            <p className="text-muted-foreground">Here&apos;s a list of your tasks!</p>
          </div>
          <div className="flex items-center space-x-2">
            <CreateTaskDialog />
            <UserNav />
          </div>
        </div>

        {loading ? (
          <div className="text-sm text-muted-foreground">Loading tasks...</div>
        ) : (
          <DataTable data={tasks} columns={columns} />
        )}
      </div>
    </>
  )
}
