export interface User {
  id: number
  email: string
  first_name?: string
  last_name?: string
  phone_number?: string
  phone_verified: boolean
  email_verified: boolean
  identity_verified: boolean
  marketing_emails: boolean
  accepted_terms: boolean
  accepted_privacy_policy: boolean
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterFormData {
  email: string
  password1: string
  password2: string
  first_name?: string
  last_name?: string
  phone_number?: string
  address_line1?: string
  address_line2?: string | null
  city?: string
  postal_code?: string
  country?: string
  date_of_birth: string
  drivers_license_number?: string
  drivers_license_expiry?: string
  accepted_terms: boolean
  accepted_privacy_policy: boolean
  marketing_emails?: boolean
}