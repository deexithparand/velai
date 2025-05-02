"use client"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import { useEffect, useState } from "react";

export function UserNav() {
  const [username, setUsername] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const router = useRouter() // Hook to handle navigation

  useEffect(() => {
    // Retrieve email from localStorage
    const storedEmail = localStorage.getItem("userEmail")
    if (storedEmail) {
      // Extract the username from the email (everything before '@')
      const extractedUsername = storedEmail.split('@')[0]
      setUsername(extractedUsername)
      setEmail(storedEmail)
    }
  }, [])

  // Handle logout
  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem("userEmail")
    localStorage.removeItem("jwtToken") // Optionally remove JWT token if it's stored

    // Redirect to the login page
    router.push("/login")
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage src="/avatars/03.png" alt={username} />
            <AvatarFallback>{username ? username[0] : "U"}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{username}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
