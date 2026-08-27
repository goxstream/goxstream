export type LoginMethod = "password" | "magic-link"

export interface LoginFormData {
  email: string
  password?: string
  otp?: string
}
