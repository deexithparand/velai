"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { toast } from "sonner"

export function CreateTaskDialog() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState("todo")
  const [priority, setPriority] = useState("medium")
  const [suggestedPlaceholder, setSuggestedPlaceholder] = useState("")
  const [loading, setLoading] = useState(false)
  const [suggesting, setSuggesting] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [currentSuggestionIndex, setCurrentSuggestionIndex] = useState(0)

  const handleCreateTask = async () => {
    if (!description) return
    setLoading(true)
  
    const email = localStorage.getItem("userEmail")
    const token = localStorage.getItem("token")
  
    if (!email || !token) {
      console.error("Missing user email or token")
      return
    }
  
    // Generate a random number for the task ID
    const randomId = Math.floor(Math.random() * 1000) + 100
    const taskId = `task-${randomId}`
  
    const newTask = {
      id: taskId,
      title: description, // or replace with a separate title field
      status,
      priority,
      label: "api", // or you can make this dynamic
      agent: email,
      email: email,
    }
  
    try {
      const res = await fetch("http://localhost:8000/api/add-task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newTask),
      })
  
      if (!res.ok) {
        throw new Error("Failed to create task")
      }
      
      toast.success("Task deleted successfully")
      setDialogOpen(false)
      console.log("Task created successfully")
    } catch (err) {
      console.error("Error creating task:", err)
    } finally {
      setDescription("")
      setStatus("todo")
      setPriority("medium")
      setSuggestedPlaceholder("")
      setLoading(false)
    }
  }
  
  const handleSuggestWithAI = async () => {
    setSuggesting(true)
    try {
      const token = localStorage.getItem("token")
      const email = localStorage.getItem("userEmail")

      console.log("token : ",token)
      console.log("email : ",email)
  
      if (!token || !email) {
        throw new Error("Missing token or email")
      }

  
      const res = await fetch("http://localhost:8000/api/suggest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email }),
      })
  
      if (!res.ok) {
        throw new Error("Suggestion API call failed")
      }
  
      const data = await res.json()
  
      if (data.suggestions && data.suggestions.length > 0) {
        setSuggestions(data.suggestions)
        setSuggestedPlaceholder(data.suggestions[0])
        setCurrentSuggestionIndex(0)
      } else {
        // Fallback if suggestions array is empty
        const fallback = "AI couldn't generate suggestions right now"
        setSuggestions([fallback])
        setSuggestedPlaceholder(fallback)
      }
    } catch (err) {
      console.error("AI Suggestion error:", err)
      const fallback = "AI couldn't generate suggestions right now"
      setSuggestions([fallback])
      setSuggestedPlaceholder(fallback)
    } finally {
      setSuggesting(false)
    }
  }
  

  const handleNextSuggestion = () => {
    if (suggestions.length > 1) {
      const nextIndex = (currentSuggestionIndex + 1) % suggestions.length
      setCurrentSuggestionIndex(nextIndex)
      setSuggestedPlaceholder(suggestions[nextIndex])
    }
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">+ Add Task</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px] p-6">
        <DialogHeader>
          <DialogTitle className="text-xl">Create a new task</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Fill in the details and click create.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="description">Description</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSuggestWithAI}
                disabled={suggestions.length > 0}
              >
                {suggesting ? "Thinking..." : "Suggest with AI"}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNextSuggestion}
                disabled={suggestions.length <= 1}
              >
                Next Suggestion
              </Button>
            </div>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={suggestedPlaceholder || "e.g. Fix login bug"}
              className="h-10 text-sm"
            />
          </div>

          <div className="grid gap-2">
            <Label>Status</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {status === "todo"
                    ? "Todo"
                    : status === "inprogress"
                    ? "In Progress"
                    : "Completed"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full">
                <DropdownMenuItem onSelect={() => setStatus("todo")}>
                  Todo
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setStatus("inprogress")}>
                  In Progress
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setStatus("completed")}>
                  Completed
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="grid gap-2">
            <Label>Priority</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full">
                <DropdownMenuItem onSelect={() => setPriority("high")}>
                  High
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setPriority("medium")}>
                  Medium
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setPriority("low")}>
                  Low
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleCreateTask} disabled={loading}>
            {loading ? "Creating..." : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
