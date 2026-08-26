"use client"

import React, { useState } from "react"
import Link from "next/link"
import { EyeIcon, EyeOffIcon, KeyRoundIcon, MailIcon, ArrowLeftIcon } from "lucide-react"
import { SiGoogle, SiDiscord } from "@icons-pack/react-simple-icons"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { Skeleton } from "@/components/ui/skeleton"

import type { LoginMethod } from "../types"

export function LoginForm() {
  const [loginMethod, setLoginMethod] = useState<LoginMethod>("password")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [otpSent, setOtpSent] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      if (loginMethod === "magic-link") {
        setOtpSent(true)
      }
    }, 1200)
  }

  const slotClassName =
    "size-11 sm:size-12 border-border/80 bg-background text-foreground font-mono text-base font-bold dark:bg-muted/40"

  return (
    <Card className="w-full max-w-md border-border/60 shadow-xs rounded-xl">
      <CardHeader className="text-center">
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-1 text-xs text-muted-foreground hover:text-foreground mb-2 transition-colors self-center"
        >
          <ArrowLeftIcon data-icon="inline-start" className="size-3" />
          Back to Home
        </Link>
        <CardTitle className="text-2xl font-bold tracking-tight">
          Sign in to GoxStream
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Stream thousands of your favorite anime without limits
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-5">
        {/* Social Authentication */}
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" type="button" className="w-full">
            <SiGoogle data-icon="inline-start" className="size-4" />
            Google
          </Button>
          <Button variant="outline" type="button" className="w-full">
            <SiDiscord data-icon="inline-start" className="size-4 text-[#5865F2]" />
            Discord
          </Button>
        </div>

        <FieldSeparator>or continue with</FieldSeparator>

        {/* Dynamic Mode Switcher */}
        <div className="flex rounded-lg bg-muted/60 p-1 text-xs font-medium">
          <button
            type="button"
            onClick={() => {
              setLoginMethod("password")
              setOtpSent(false)
            }}
            className={`flex-1 rounded-md py-1.5 transition-all ${
              loginMethod === "password"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Password
          </button>
          <button
            type="button"
            onClick={() => setLoginMethod("magic-link")}
            className={`flex-1 rounded-md py-1.5 transition-all ${
              loginMethod === "magic-link"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Magic Link / OTP
          </button>
        </div>

        {/* Loading Placeholder Skeleton */}
        {isLoading ? (
          <div className="flex flex-col gap-4">
            <Skeleton className="h-10 w-full rounded-md" />
            <Skeleton className="h-10 w-full rounded-md" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <FieldGroup className="gap-4">
              <Field>
                <FieldLabel htmlFor="email">Email Address</FieldLabel>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    required
                    className="pr-10"
                  />
                  <MailIcon className="absolute right-3 top-2.5 size-4 text-muted-foreground pointer-events-none" />
                </div>
              </Field>

              {loginMethod === "password" ? (
                <Field>
                  <div className="flex items-center justify-between">
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Link
                      href="/forgot-password"
                      className="text-xs text-primary hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOffIcon className="size-4" />
                      ) : (
                        <EyeIcon className="size-4" />
                      )}
                      <span className="sr-only">Toggle password visibility</span>
                    </button>
                  </div>
                </Field>
              ) : (
                <>
                  {otpSent && (
                    <div className="flex flex-col items-center gap-2.5 w-full text-center py-1">
                      <FieldLabel
                        htmlFor="otp"
                        className="self-center text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                      >
                        Verification Code (OTP)
                      </FieldLabel>
                      <div className="flex justify-center w-full py-1">
                        <InputOTP
                          maxLength={6}
                          id="otp"
                          containerClassName="justify-center w-auto mx-auto gap-2"
                          className="w-auto mx-auto"
                        >
                          <InputOTPGroup className="shadow-xs">
                            <InputOTPSlot index={0} className={slotClassName} />
                            <InputOTPSlot index={1} className={slotClassName} />
                            <InputOTPSlot index={2} className={slotClassName} />
                          </InputOTPGroup>
                          <InputOTPSeparator />
                          <InputOTPGroup className="shadow-xs">
                            <InputOTPSlot index={3} className={slotClassName} />
                            <InputOTPSlot index={4} className={slotClassName} />
                            <InputOTPSlot index={5} className={slotClassName} />
                          </InputOTPGroup>
                        </InputOTP>
                      </div>
                      <p className="text-xs text-muted-foreground text-center">
                        A 6-digit code has been sent to your email address.
                      </p>
                    </div>
                  )}
                </>
              )}

              <Button type="submit" className="w-full mt-2">
                {loginMethod === "password" ? (
                  "Sign In"
                ) : otpSent ? (
                  "Verify & Sign In"
                ) : (
                  <>
                    <KeyRoundIcon data-icon="inline-start" className="size-4" />
                    Send Magic Link
                  </>
                )}
              </Button>
            </FieldGroup>
          </form>
        )}
      </CardContent>

      <CardFooter className="flex justify-center border-t border-border/40 py-4">
        <p className="text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link href="/signup" className="font-semibold text-primary hover:underline">
            Sign Up Now
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
