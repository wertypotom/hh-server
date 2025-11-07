export interface User {
  id: string
  hhUserId?: string
  userName?: string
  email?: string
  firstName?: string
  lastName?: string
  accessToken?: string
  refreshToken?: string
  tokenExpiresAt?: number
  createdAt?: FirebaseFirestore.Timestamp
  updatedAt?: FirebaseFirestore.Timestamp
}

export interface CreateUserDto {
  userName: string
}

export interface HHUser {
  hhUserId: string
  email: string
  firstName: string
  lastName: string
  accessToken: string
  refreshToken: string
  tokenExpiresAt: number
}
