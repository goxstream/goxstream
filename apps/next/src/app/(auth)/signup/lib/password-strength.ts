import type { PasswordStrengthResult, PasswordRequirement } from "../types"

export function getPasswordStrength(pwd: string): PasswordStrengthResult {
  if (!pwd) {
    return {
      score: 0,
      label: "",
      color: "bg-muted",
      requirements: [
        { id: "length", label: "At least 8 characters", met: false },
        { id: "uppercase", label: "At least one uppercase letter (A-Z)", met: false },
        { id: "number", label: "At least one number (0-9)", met: false },
        { id: "special", label: "At least one special character (!@#$)", met: false },
      ],
    }
  }

  const requirements: PasswordRequirement[] = [
    {
      id: "length",
      label: "At least 8 characters",
      met: pwd.length >= 8,
    },
    {
      id: "uppercase",
      label: "At least one uppercase letter (A-Z)",
      met: /[A-Z]/.test(pwd),
    },
    {
      id: "number",
      label: "At least one number (0-9)",
      met: /[0-9]/.test(pwd),
    },
    {
      id: "special",
      label: "At least one special character (!@#$)",
      met: /[^A-Za-z0-9]/.test(pwd),
    },
  ]

  const metCount = requirements.filter((r) => r.met).length

  let label: "Weak" | "Medium" | "Strong" | "Very Strong" | "" = "Weak"
  let color = "bg-destructive"

  if (metCount === 1) {
    label = "Weak"
    color = "bg-destructive"
  } else if (metCount === 2) {
    label = "Medium"
    color = "bg-amber-500"
  } else if (metCount === 3) {
    label = "Strong"
    color = "bg-emerald-500"
  } else if (metCount === 4) {
    label = "Very Strong"
    color = "bg-primary"
  }

  return {
    score: metCount,
    label,
    color,
    requirements,
  }
}
