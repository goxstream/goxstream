export interface PasswordStrengthResult {
  score: number
  label: string
  color: string
}

export interface SignupFormData {
  username: string
  email: string
  password: string
  agreed: boolean
}
