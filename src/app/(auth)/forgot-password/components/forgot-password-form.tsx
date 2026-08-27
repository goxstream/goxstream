"use client"

import React, { useState } from "react"
import Link from "next/link"
import { ArrowLeftIcon, MailCheckIcon, SendIcon } from "lucide-react"

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
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Skeleton } from "@/components/ui/skeleton"

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSent, setIsSent] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setIsSent(true)
    }, 1200)
  }

  if (isSent) {
    return (
      <Card className="w-full max-w-md border-border/60 shadow-xs rounded-xl text-center">
        <CardHeader>
          <div className="mx-auto size-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
            <MailCheckIcon className="size-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Check Your Email</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Password reset instructions have been sent to{" "}
            <span className="font-semibold text-foreground">{email}</span>.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex flex-col gap-3 pb-6">
          <Button
            variant="outline"
            className="w-full cursor-pointer"
            onClick={() => setIsSent(false)}
          >
            Resend Email
          </Button>
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <ArrowLeftIcon data-icon="inline-start" className="size-3" />
            Back to Sign In
          </Link>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md border-border/60 shadow-xs rounded-xl">
      <CardHeader className="text-center">
        <Link
          href="/login"
          className="inline-flex items-center justify-center gap-1 text-xs text-muted-foreground hover:text-foreground mb-2 transition-colors self-center cursor-pointer"
        >
          <ArrowLeftIcon data-icon="inline-start" className="size-3" />
          Back to Sign In
        </Link>
        <CardTitle className="text-2xl font-bold tracking-tight">
          Forgot Password?
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Enter your registered email address to receive reset instructions
        </CardDescription>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="flex flex-col gap-4">
            <Skeleton className="h-10 w-full rounded-md" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <FieldGroup className="gap-4">
              <Field>
                <FieldLabel htmlFor="reset-email">Email Address</FieldLabel>
                <Input
                  id="reset-email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Field>

              <Button type="submit" className="w-full mt-2 cursor-pointer">
                <SendIcon data-icon="inline-start" className="size-4" />
                Send Reset Link
              </Button>
            </FieldGroup>
          </form>
        )}
      </CardContent>

      <CardFooter className="flex justify-center border-t border-border/40 py-4">
        <p className="text-xs text-muted-foreground text-center">
          Remember your password?{" "}
          <Link href="/login" className="font-semibold text-primary hover:underline cursor-pointer">
            Sign In
          </Link>
        </p>
      </CardFooter>

    </Card>
  )
}
