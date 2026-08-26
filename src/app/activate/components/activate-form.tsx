"use client"

import React, { useState } from "react"
import Link from "next/link"
import { TvIcon, CheckCircle2Icon, ArrowLeftIcon } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { Skeleton } from "@/components/ui/skeleton"

export function ActivateForm() {
  const [code, setCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isPaired, setIsPaired] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (code.length < 6) return
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setIsPaired(true)
    }, 1200)
  }

  if (isPaired) {
    return (
      <Card className="w-full max-w-md border-border/60 shadow-xs rounded-xl text-center">
        <CardHeader>
          <div className="mx-auto size-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-2">
            <CheckCircle2Icon className="size-6" />
          </div>
          <CardTitle className="text-2xl font-bold">Device Connected!</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Your TV / device has been successfully paired with your GoxStream account.
            Your TV screen will refresh automatically.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-center pb-6">
          <Link
            href="/"
            className={buttonVariants({ variant: "default", className: "w-full" })}
          >
            Back to Home
          </Link>
        </CardFooter>
      </Card>
    )
  }

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
        <div className="mx-auto size-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-1">
          <TvIcon className="size-6" />
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight">
          Activate TV Device
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Enter the 6-character code displayed on your TV or smart device
        </CardDescription>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="flex flex-col gap-4 items-center">
            <Skeleton className="h-12 w-64 rounded-md" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <FieldGroup className="gap-5 items-center">
              <Field className="items-center">
                <FieldLabel htmlFor="tv-code">Activation Code (6 Characters)</FieldLabel>
                <InputOTP
                  maxLength={6}
                  id="tv-code"
                  value={code}
                  onChange={(val) => setCode(val.toUpperCase())}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </Field>

              <Button
                type="submit"
                disabled={code.length < 6}
                className="w-full mt-2"
              >
                Connect Device
              </Button>
            </FieldGroup>
          </form>
        )}
      </CardContent>

      <CardFooter className="flex justify-center border-t border-border/40 py-4">
        <p className="text-xs text-muted-foreground text-center">
          Can't find your code? Open the GoxStream app on your TV and select <strong>Sign in via Web</strong>.
        </p>
      </CardFooter>
    </Card>
  )
}
