export interface UserProps {
  id: string
  username: string
  firstName?: string | null
  lastName?: string | null
  email: string
  phone?: string | null
  language: string | null
  others: any
  avatar?: string | null
  lastLogin: Date
  isFirstLogin: boolean
  token: string
}
export interface ObtainTokenProps {
  username: string
  password: string
}

export interface RegisterProps {
  username: string
  email: string
  fistName: string
  lastName: string
}

export interface ValidOtpProps {
  pk: string
  otp: string
}

export interface UserNode {
  avatar: string
  dateJoined: Date
  dob: Date
  email: string
  firstName: string
  gender: 'Male' | 'Female'
  isActive: boolean
  isEmail: boolean
  isPhone: boolean
  language: 'Vietnamese' | 'English'
  lastName: string
  phone: string
  username: string
}
export interface DeviceAuthProps {
  deviceId: string
  registrationId: number
  deviceToken: string
}
