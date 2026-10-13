export interface PasswordRequirement {
  id: string
  label: string
  met: boolean
}

export interface PasswordStrengthResult {
  score: number
  label: "Weak" | "Medium" | "Strong" | "Very Strong" | ""
  color: string
  requirements: PasswordRequirement[]
}

export interface SignupFormData {
  username: string
  email: string
  password: string
  agreed: boolean
}
