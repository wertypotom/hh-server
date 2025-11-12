import axios from 'axios'
import { envConfig } from '@config/env.config'
import { TokenResponse, HHUserInfo } from '../auth.types'
import { InternalServerError } from '@utils/errors'
import { Logger } from '@utils/logger'

export class HHApiService {
  private axiosInstance

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: 'https://api.hh.ru',
      timeout: 10000,
    })
  }

  async exchangeCodeForToken(code: string): Promise<TokenResponse> {
    try {
      const response = await this.axiosInstance.post<TokenResponse>(
        '/token',
        new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: envConfig.hhClientId,
          client_secret: envConfig.hhClientSecret,
          code,
          redirect_uri: envConfig.hhRedirectUri,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      )

      return response.data
    } catch (error: any) {
      Logger.error('Error exchanging code for token:', error.response?.data)
      throw new InternalServerError('Failed to exchange authorization code')
    }
  }

  async getUserInfo(accessToken: string): Promise<HHUserInfo> {
    try {
      const response = await this.axiosInstance.get<HHUserInfo>('/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      return response.data
    } catch (error: any) {
      Logger.error('Error fetching user info:', error.response?.data)
      throw new InternalServerError('Failed to fetch user information')
    }
  }

  async refreshAccessToken(refreshToken: string): Promise<TokenResponse> {
    try {
      const response = await this.axiosInstance.post<TokenResponse>(
        '/token',
        new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
          client_id: envConfig.hhClientId,
          client_secret: envConfig.hhClientSecret,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      )

      return response.data
    } catch (error: any) {
      Logger.error('Error refreshing token:', error.response?.data)
      throw new InternalServerError('Failed to refresh access token')
    }
  }
}
