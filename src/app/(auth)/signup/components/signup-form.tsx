"use client"

import React, { useState } from "react"
import Link from "next/link"
import { EyeIcon, EyeOffIcon, ArrowLeftIcon, CheckIcon, XIcon, AlertCircleIcon } from "lucide-react"
import { SiGoogle, SiDiscord } from "@icons-pack/react-simple-icons"

import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LogoBrand } from "@/components/logo-brand"
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

import { getPasswordStrength } from "../lib/password-strength"

export function SignupForm() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const strength = getPasswordStrength(password)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!agreed) return

    setError(null)
    setIsLoading(true)

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      })

      const data = (await res.json()) as { success?: boolean; error?: string }

      if (!res.ok || !data.success) {
        setError(data.error || "Registration failed. Please try again.")
        setIsLoading(false)
        return
      }

      setIsLoading(false)
      setIsSuccess(true)
    } catch {
      setError("Connection error. Please try again.")
      setIsLoading(false)
    }
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
            Your account has been created successfully. You can now start exploring GoxStream.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-center pb-6">
          <Link
            href="/"
            className={buttonVariants({ variant: "default", className: "w-full" })}
          >
            Start Watching Now
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
        <LogoBrand variant="1:1" size="lg" className="mx-auto mb-2" />
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
            <SiGoogle data-icon="inline-start" className="size-4" />
            Google
          </Button>
          <Button variant="outline" type="button" className="w-full">
            <SiDiscord data-icon="inline-start" className="size-4 text-[#5865F2]" />
            Discord
          </Button>
        </div>

        <FieldSeparator>or register with email</FieldSeparator>

        {error && (
          <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-xs font-medium text-destructive border border-destructive/20">
            <AlertCircleIcon className="size-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

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
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="signup-email">Email Address</FieldLabel>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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

                {/* Password Strength Meter & Interactive Requirements Checklist */}
                {password && (
                  <div className="flex flex-col gap-2 mt-2 rounded-lg bg-muted/40 p-3 border border-border/40 text-xs">
                    <div className="flex items-center justify-between font-medium">
                      <span>Password Strength</span>
                      <span className="text-muted-foreground">{strength.label}</span>
                    </div>
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
                      <div
                        className={`flex-1 rounded-full transition-colors ${
                          strength.score >= 4 ? strength.color : "bg-muted"
                        }`}
                      />
                    </div>

                    <ul className="flex flex-col gap-1 mt-1 text-[11px]">
                      {strength.requirements.map((req) => (
                        <li
                          key={req.id}
                          className={`flex items-center gap-1.5 transition-colors ${
                            req.met
                              ? "text-emerald-500 font-medium"
                              : "text-muted-foreground opacity-75"
                          }`}
                        >
                          {req.met ? (
                            <CheckIcon data-icon="inline-start" className="size-3 shrink-0" />
                          ) : (
                            <XIcon data-icon="inline-start" className="size-3 shrink-0" />
                          )}
                          <span>{req.label}</span>
                        </li>
                      ))}
                    </ul>
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
