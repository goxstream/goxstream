"use client";

import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import {
  EyeIcon,
  EyeOffIcon,
  KeyRoundIcon,
  MailIcon,
  ArrowLeftIcon,
  AlertCircleIcon,
} from "lucide-react";
import { SiGoogle, SiDiscord } from "@icons-pack/react-simple-icons";

import { Button } from "@shionstream/ui/components/button";
import { Input } from "@shionstream/ui/components/input";
import { LogoBrand } from "@/components/logo-brand";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@shionstream/ui/components/card";
import { Skeleton } from "@shionstream/ui/components/skeleton";
import { authClient } from "@/lib/auth-client";

type LoginMethod = "password" | "magic-link";

export function LoginForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [loginMethod, setLoginMethod] = useState<LoginMethod>("password");
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const redirectUrl = searchParams.get("redirect") || "/";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (loginMethod === "magic-link") {
      // TODO: Implement magic link via Better Auth when supported
      setError("Magic link login is not yet available.");
      setIsLoading(false);
      return;
    }

    try {
      const { error: authError } = await authClient.signIn.email({
        email: emailOrUsername,
        password,
      });

      if (authError) {
        setError(authError.message || "Invalid login credentials.");
        setIsLoading(false);
        return;
      }

      navigate(redirectUrl);
    } catch {
      setError("Connection error. Please try again.");
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: "google" | "discord") => {
    try {
      await authClient.signIn.social({
        provider,
        callbackURL: redirectUrl,
      });
    } catch {
      setError(`Failed to connect with ${provider}. Please try again.`);
    }
  };

  return (
    <Card className="border-border/60 w-full max-w-md rounded-xl shadow-xs">
      <CardHeader className="text-center">
        <Link
          to="/"
          className="text-muted-foreground hover:text-foreground mb-2 inline-flex cursor-pointer items-center justify-center gap-1 self-center text-xs transition-colors"
        >
          <ArrowLeftIcon data-icon="inline-start" className="size-3" />
          Back to Home
        </Link>
        <LogoBrand variant="1:1" size="lg" className="mx-auto mb-2" />
        <CardTitle className="text-2xl font-bold tracking-tight">Sign in to ShionStream</CardTitle>
        <CardDescription className="text-muted-foreground text-sm">
          Stream thousands of your favorite anime without limits
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-5">
        {/* Social Authentication */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            type="button"
            className="w-full cursor-pointer"
            onClick={() => handleSocialLogin("google")}
          >
            <SiGoogle data-icon="inline-start" className="size-4" />
            Google
          </Button>
          <Button
            variant="outline"
            type="button"
            className="w-full cursor-pointer"
            onClick={() => handleSocialLogin("discord")}
          >
            <SiDiscord data-icon="inline-start" className="size-4 text-[#5865F2]" />
            Discord
          </Button>
        </div>

        <div className="relative flex items-center gap-3 text-xs">
          <div className="bg-border h-px flex-1" />
          <span className="text-muted-foreground">or continue with</span>
          <div className="bg-border h-px flex-1" />
        </div>

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
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email Address or Username
                </label>
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
              </div>

              {loginMethod === "password" && (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="text-sm font-medium">
                      Password
                    </label>
                    <Link
                      to="/forgot-password"
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
                </div>
              )}

              <Button type="submit" className="mt-2 w-full cursor-pointer">
                {loginMethod === "password" ? (
                  "Sign In"
                ) : (
                  <>
                    <KeyRoundIcon data-icon="inline-start" className="size-4" />
                    Send Magic Link
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </CardContent>

      <CardFooter className="border-border/40 flex justify-center border-t py-4">
        <p className="text-muted-foreground text-sm">
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="text-primary cursor-pointer font-semibold hover:underline">
            Sign Up Now
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
