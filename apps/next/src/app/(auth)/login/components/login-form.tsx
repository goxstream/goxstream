"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  EyeIcon,
  EyeOffIcon,
  KeyRoundIcon,
  MailIcon,
  ArrowLeftIcon,
  AlertCircleIcon,
} from "lucide-react";
import { SiGoogle, SiDiscord } from "@icons-pack/react-simple-icons";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogoBrand } from "@/components/logo-brand";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel, FieldSeparator } from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Skeleton } from "@/components/ui/skeleton";

import type { LoginMethod } from "../types";

export function LoginForm() {
  const router = useRouter();

  const [loginMethod, setLoginMethod] = useState<LoginMethod>("password");
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (loginMethod === "magic-link") {
      setTimeout(() => {
        setIsLoading(false);
        setOtpSent(true);
      }, 1000);
      return;
    }

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usernameOrEmail: emailOrUsername,
          password,
        }),
      });

      const data = (await res.json()) as { success?: boolean; error?: string };

      if (!res.ok || !data.success) {
        setError(data.error || "Invalid login credentials.");
        setIsLoading(false);
        return;
      }

      const redirectUrl =
        (typeof window !== "undefined"
          ? new URLSearchParams(window.location.search).get("redirect")
          : null) || "/";
      router.push(redirectUrl);
    } catch {
      setError("Connection error. Please try again.");
      setIsLoading(false);
    }
  };

  const slotClassName =
    "size-11 sm:size-12 border-border/80 bg-background text-foreground font-mono text-base font-bold dark:bg-muted/40";

  return (
    <Card className="border-border/60 w-full max-w-md rounded-xl shadow-xs">
      <CardHeader className="text-center">
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground mb-2 inline-flex cursor-pointer items-center justify-center gap-1 self-center text-xs transition-colors"
        >
          <ArrowLeftIcon data-icon="inline-start" className="size-3" />
          Back to Home
        </Link>
        <LogoBrand variant="1:1" size="lg" className="mx-auto mb-2" />
        <CardTitle className="text-2xl font-bold tracking-tight">Sign in to GoxStream</CardTitle>
        <CardDescription className="text-muted-foreground text-sm">
          Stream thousands of your favorite anime without limits
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-5">
        {/* Social Authentication */}
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" type="button" className="w-full cursor-pointer">
            <SiGoogle data-icon="inline-start" className="size-4" />
            Google
          </Button>
          <Button variant="outline" type="button" className="w-full cursor-pointer">
            <SiDiscord data-icon="inline-start" className="size-4 text-[#5865F2]" />
            Discord
          </Button>
        </div>

        <FieldSeparator>or continue with</FieldSeparator>

        {error && (
          <div className="bg-destructive/10 text-destructive border-destructive/20 flex items-center gap-2 rounded-lg border p-3 text-xs font-medium">
            <AlertCircleIcon className="size-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Dynamic Mode Switcher */}
        <div className="bg-muted/60 flex rounded-lg p-1 text-xs font-medium">
          <button
            type="button"
            onClick={() => {
              setLoginMethod("password");
              setOtpSent(false);
              setError(null);
            }}
            className={`flex-1 cursor-pointer rounded-md py-1.5 transition-all ${
              loginMethod === "password"
                ? "bg-background text-foreground font-semibold shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Password
          </button>
          <button
            type="button"
            onClick={() => {
              setLoginMethod("magic-link");
              setError(null);
            }}
            className={`flex-1 cursor-pointer rounded-md py-1.5 transition-all ${
              loginMethod === "magic-link"
                ? "bg-background text-foreground font-semibold shadow-xs"
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
                <FieldLabel htmlFor="email">Email Address or Username</FieldLabel>
                <div className="relative">
                  <Input
                    id="email"
                    type="text"
                    placeholder="name@example.com or username"
                    value={emailOrUsername}
                    onChange={(e) => setEmailOrUsername(e.target.value)}
                    required
                    className="pr-10"
                  />
                  <MailIcon className="text-muted-foreground pointer-events-none absolute top-2.5 right-3 size-4" />
                </div>
              </Field>

              {loginMethod === "password" ? (
                <Field>
                  <div className="flex items-center justify-between">
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Link
                      href="/forgot-password"
                      className="text-primary cursor-pointer text-xs hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-muted-foreground hover:text-foreground absolute top-2.5 right-3 cursor-pointer"
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
                    <div className="flex w-full flex-col items-center gap-2.5 py-1 text-center">
                      <FieldLabel
                        htmlFor="otp"
                        className="text-muted-foreground self-center text-center text-xs font-semibold tracking-wider uppercase"
                      >
                        Verification Code (OTP)
                      </FieldLabel>
                      <div className="flex w-full justify-center py-1">
                        <InputOTP
                          maxLength={6}
                          id="otp"
                          containerClassName="justify-center w-auto mx-auto gap-2"
                          className="mx-auto w-auto"
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
                      <p className="text-muted-foreground text-center text-xs">
                        A 6-digit code has been sent to your email address.
                      </p>
                    </div>
                  )}
                </>
              )}

              <Button type="submit" className="mt-2 w-full cursor-pointer">
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

      <CardFooter className="border-border/40 flex justify-center border-t py-4">
        <p className="text-muted-foreground text-sm">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="text-primary cursor-pointer font-semibold hover:underline"
          >
            Sign Up Now
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
