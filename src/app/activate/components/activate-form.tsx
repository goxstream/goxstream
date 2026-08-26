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
import { FieldLabel } from "@/components/ui/field"
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

  const slotClassName =
    "size-11 sm:size-12 border-border/80 bg-background text-foreground font-mono text-base font-bold dark:bg-muted/40"

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
          <form onSubmit={handleSubmit} className="w-full">
            <div className="flex flex-col gap-5 items-center w-full">
              <div className="flex flex-col items-center gap-2.5 w-full text-center">
                <FieldLabel
                  htmlFor="tv-code"
                  className="self-center text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                >
                  Activation Code (6 Characters)
                </FieldLabel>
                <div className="flex justify-center w-full py-1">
                  <InputOTP
                    maxLength={6}
                    id="tv-code"
                    value={code}
                    onChange={(val) => setCode(val.toUpperCase())}
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
              </div>

              <Button
                type="submit"
                disabled={code.length < 6}
                className="w-full"
              >
                Connect Device
              </Button>
            </div>
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
