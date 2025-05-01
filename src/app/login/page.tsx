"use client"

import { GalleryVerticalEnd } from "lucide-react"

import { SignupForm } from "@/components/signup-form"

import { LoginForm } from "@/components/login-form"
import { useState } from "react"

export default function LoginPage() {
  const [isSignup, setIsSignup] = useState(false)

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            VELAI
          </a>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center gap-6">
          <div className="w-full max-w-xs">
            {isSignup ? <SignupForm /> : <LoginForm />}
          </div>

          <div className="text-center text-sm">
            {isSignup ? (
              <>
                Already have an account?{" "}
                <span
                  className="underline underline-offset-4 cursor-pointer"
                  onClick={() => setIsSignup(false)}
                >
                  Login
                </span>
              </>
            ) : (
              <>
                Don’t have an account?{" "}
                <span
                  className="underline underline-offset-4 cursor-pointer"
                  onClick={() => setIsSignup(true)}
                >
                  Sign up
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="bg-muted relative hidden lg:block">
        <img
          src="/velai-banner.jpg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}
