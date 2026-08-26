"use client"

import React, { useState } from "react"
import Link from "next/link"
import { EyeIcon, EyeOffIcon, ArrowLeftIcon, CheckIcon } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
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
import { Skeleton } from "@/components/ui/skeleton"
import { DiscordIcon, GoogleIcon } from "@/components/brand-icons"

export function SignupForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState("")
  const [agreed, setAgreed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  // Simple Password Strength Calculator
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: "", color: "bg-muted" }
    if (pwd.length < 6) return { score: 1, label: "Weak", color: "bg-destructive" }
    if (pwd.length < 10 || !/\d/.test(pwd))
      return { score: 2, label: "Medium", color: "bg-amber-500" }
    return { score: 3, label: "Strong", color: "bg-primary" }
  }

  const strength = getPasswordStrength(password)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!agreed) return
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setIsSuccess(true)
    }, 1200)
  }

  if (isSuccess) {
    return (
      <Card className="w-full max-w-md border-border/60 shadow-xs rounded-xl text-center">
        <CardHeader>
          <div className="mx-auto size-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
            <CheckIcon className="size-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Registration Successful!</CardTitle>
          <CardDescription>
            A confirmation link has been sent to your email. Please verify to start watching.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-center pb-6">
          <Link
            href="/login"
            className={buttonVariants({ variant: "default", className: "w-full" })}
          >
            Proceed to Sign In
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
        <CardTitle className="text-2xl font-bold tracking-tight">
          Create GoxStream Account
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Join the ultimate anime streaming community now
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-5">
        {/* Social Registration */}
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" type="button" className="w-full">
            <GoogleIcon data-icon="inline-start" className="size-4" />
            Google
          </Button>
          <Button variant="outline" type="button" className="w-full">
            <DiscordIcon data-icon="inline-start" className="size-4 text-[#5865F2]" />
            Discord
          </Button>
        </div>

        <FieldSeparator>or register with email</FieldSeparator>

        {isLoading ? (
          <div className="flex flex-col gap-4">
            <Skeleton className="h-10 w-full rounded-md" />
            <Skeleton className="h-10 w-full rounded-md" />
            <Skeleton className="h-10 w-full rounded-md" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <FieldGroup className="gap-4">
              <Field>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <Input
                  id="username"
                  type="text"
                  placeholder="otaku_anime99"
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="signup-email">Email Address</FieldLabel>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="name@example.com"
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="signup-password">Password</FieldLabel>
                <div className="relative">
                  <Input
                    id="signup-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="At least 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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

                {/* Password Strength Indicator */}
                {password && (
                  <div className="flex flex-col gap-1 mt-1.5">
                    <div className="flex gap-1 h-1.5 w-full">
                      <div
                        className={`flex-1 rounded-full transition-colors ${
                          strength.score >= 1 ? strength.color : "bg-muted"
                        }`}
                      />
                      <div
                        className={`flex-1 rounded-full transition-colors ${
                          strength.score >= 2 ? strength.color : "bg-muted"
                        }`}
                      />
                      <div
                        className={`flex-1 rounded-full transition-colors ${
                          strength.score >= 3 ? strength.color : "bg-muted"
                        }`}
                      />
                    </div>
                    <span className="text-[11px] text-muted-foreground text-right font-medium">
                      Strength: {strength.label}
                    </span>
                  </div>
                )}
              </Field>

              {/* Terms & Privacy Agreement */}
              <Field orientation="horizontal" className="items-start gap-2 pt-1">
                <Checkbox
                  id="terms"
                  checked={agreed}
                  onCheckedChange={(checked) => setAgreed(!!checked)}
                  required
                />
                <FieldLabel htmlFor="terms" className="text-xs font-normal text-muted-foreground leading-normal">
                  I agree to the{" "}
                  <Link href="#" className="text-primary underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="#" className="text-primary underline">
                    Privacy Policy
                  </Link>
                </FieldLabel>
              </Field>

              <Button type="submit" disabled={!agreed} className="w-full mt-2">
                Create Account
              </Button>
            </FieldGroup>
          </form>
        )}
      </CardContent>

      <CardFooter className="flex justify-center border-t border-border/40 py-4">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Sign In
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
