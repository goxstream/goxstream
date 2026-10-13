"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeftIcon, MailCheckIcon, SendIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Skeleton } from "@/components/ui/skeleton";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSent(true);
    }, 1200);
  };

  if (isSent) {
    return (
      <Card className="border-border/60 w-full max-w-md rounded-xl text-center shadow-xs">
        <CardHeader>
          <div className="bg-primary/10 mx-auto mb-2 flex size-12 items-center justify-center rounded-full">
            <MailCheckIcon className="text-primary size-6" />
          </div>
          <CardTitle className="text-2xl font-bold">Check Your Email</CardTitle>
          <CardDescription className="text-muted-foreground text-sm">
            Password reset instructions have been sent to{" "}
            <span className="text-foreground font-semibold">{email}</span>.
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
            className="text-muted-foreground hover:text-foreground inline-flex cursor-pointer items-center justify-center gap-1 text-xs transition-colors"
          >
            <ArrowLeftIcon data-icon="inline-start" className="size-3" />
            Back to Sign In
          </Link>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="border-border/60 w-full max-w-md rounded-xl shadow-xs">
      <CardHeader className="text-center">
        <Link
          href="/login"
          className="text-muted-foreground hover:text-foreground mb-2 inline-flex cursor-pointer items-center justify-center gap-1 self-center text-xs transition-colors"
        >
          <ArrowLeftIcon data-icon="inline-start" className="size-3" />
          Back to Sign In
        </Link>
        <CardTitle className="text-2xl font-bold tracking-tight">Forgot Password?</CardTitle>
        <CardDescription className="text-muted-foreground text-sm">
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

              <Button type="submit" className="mt-2 w-full cursor-pointer">
                <SendIcon data-icon="inline-start" className="size-4" />
                Send Reset Link
              </Button>
            </FieldGroup>
          </form>
        )}
      </CardContent>

      <CardFooter className="border-border/40 flex justify-center border-t py-4">
        <p className="text-muted-foreground text-center text-xs">
          Remember your password?{" "}
          <Link href="/login" className="text-primary cursor-pointer font-semibold hover:underline">
            Sign In
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
