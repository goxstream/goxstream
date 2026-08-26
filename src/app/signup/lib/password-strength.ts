import type { PasswordStrengthResult } from "../types"

export function getPasswordStrength(pwd: string): PasswordStrengthResult {
  if (!pwd) return { score: 0, label: "", color: "bg-muted" }
  if (pwd.length < 6) return { score: 1, label: "Weak", color: "bg-destructive" }
  if (pwd.length < 10 || !/\d/.test(pwd))
    return { score: 2, label: "Medium", color: "bg-amber-500" }
  return { score: 3, label: "Strong", color: "bg-primary" }
}
