"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Row } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"

import { toast } from "sonner"; // Optional: if you use toast for feedback
import { taskSchema } from "../data/schema"

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
  onDelete?: () => void // Optional callback to refresh the table
}

export function DataTableRowActions<TData>({
  row,
  onDelete,
}: DataTableRowActionsProps<TData>) {
  const task = taskSchema.parse(row.original)

  const handleDelete = async () => {
    try {
      const email = localStorage.getItem("userEmail")
      const token = localStorage.getItem("token")

      if (!email || !token) {
        toast.error("Missing credentials")
        return
      }

      const res = await fetch("https://velai-go.onrender.com/api/delete-task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email,
          taskId: task.id,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete task")
      }

      toast.success("Task deleted successfully")

      if (onDelete) onDelete() // Refresh the data table
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <MoreHorizontal />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem onClick={handleDelete}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
