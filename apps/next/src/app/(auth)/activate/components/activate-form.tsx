"use client";

import React, { useState } from "react";
import Link from "next/link";
import { TvIcon, CheckCircle2Icon, ArrowLeftIcon } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FieldLabel } from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Skeleton } from "@/components/ui/skeleton";

export function ActivateForm() {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPaired, setIsPaired] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (code.length < 6) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsPaired(true);
    }, 1200);
  };

  const slotClassName =
    "size-11 sm:size-12 border-border/80 bg-background text-foreground font-mono text-base font-bold dark:bg-muted/40";

  if (isPaired) {
    return (
      <Card className="border-border/60 w-full max-w-md rounded-xl text-center shadow-xs">
        <CardHeader>
          <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
            <CheckCircle2Icon className="size-6" />
          </div>
          <CardTitle className="text-2xl font-bold">Device Connected!</CardTitle>
          <CardDescription className="text-muted-foreground text-sm">
            Your TV / device has been successfully paired with your GoxStream account. Your TV
            screen will refresh automatically.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-center pb-6">
          <Link href="/" className={buttonVariants({ variant: "default", className: "w-full" })}>
            Back to Home
          </Link>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="border-border/60 w-full max-w-md rounded-xl shadow-xs">
      <CardHeader className="text-center">
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground mb-2 inline-flex items-center justify-center gap-1 self-center text-xs transition-colors"
        >
          <ArrowLeftIcon data-icon="inline-start" className="size-3" />
          Back to Home
        </Link>
        <div className="bg-primary/10 text-primary mx-auto mb-1 flex size-12 items-center justify-center rounded-full">
          <TvIcon className="size-6" />
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight">Activate TV Device</CardTitle>
        <CardDescription className="text-muted-foreground text-sm">
          Enter the 6-character code displayed on your TV or smart device
        </CardDescription>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="flex flex-col items-center gap-4">
            <Skeleton className="h-12 w-64 rounded-md" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="w-full">
            <div className="flex w-full flex-col items-center gap-5">
              <div className="flex w-full flex-col items-center gap-2.5 text-center">
                <FieldLabel
                  htmlFor="tv-code"
                  className="text-muted-foreground self-center text-center text-xs font-semibold tracking-wider uppercase"
                >
                  Activation Code (6 Characters)
                </FieldLabel>
                <div className="flex w-full justify-center py-1">
                  <InputOTP
                    maxLength={6}
                    id="tv-code"
                    value={code}
                    onChange={(val) => setCode(val.toUpperCase())}
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
              </div>

              <Button type="submit" disabled={code.length < 6} className="w-full">
                Connect Device
              </Button>
            </div>
          </form>
        )}
      </CardContent>

      <CardFooter className="border-border/40 flex justify-center border-t py-4">
        <p className="text-muted-foreground text-center text-xs">
          Can't find your code? Open the GoxStream app on your TV and select{" "}
          <strong>Sign in via Web</strong>.
        </p>
      </CardFooter>
    </Card>
  );
}
