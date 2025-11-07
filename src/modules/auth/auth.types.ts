export interface TokenResponse {
  access_token: string
  refresh_token: string
  expires_in: number
  token_type: string
}

export interface HHUserInfo {
  id: string
  email: string
  first_name: string
  last_name: string
  middle_name?: string
}

export interface AuthorizationUrlResponse {
  authUrl: string
}

export interface RefreshTokenRequest {
  userId: string
}
