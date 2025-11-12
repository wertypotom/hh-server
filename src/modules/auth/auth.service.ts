import { envConfig } from '@config/env.config'
import { UserRepository } from '@modules/user/user.repository'
import { HHApiService } from './services/hh-api.service'
import { AuthorizationUrlResponse } from './auth.types'
import { User } from '@modules/user/user.types'
import { BadRequestError } from '@/shared/utils/errors'

export class AuthService {
  private userRepository: UserRepository
  private hhApiService: HHApiService

  constructor() {
    this.userRepository = new UserRepository()
    this.hhApiService = new HHApiService()
  }

  generateAuthorizationUrl(): AuthorizationUrlResponse {
    const state = Math.random().toString(36).substring(7)
    const authUrl = `https://hh.ru/oauth/authorize?response_type=code&client_id=${envConfig.hhClientId}&state=${state}`

    return { authUrl }
  }

  async handleCallback(code: string): Promise<User> {
    // Exchange code for tokens
    const tokenData = await this.hhApiService.exchangeCodeForToken(code)

    // Get user info
    const userInfo = await this.hhApiService.getUserInfo(tokenData.access_token)

    // Save or update user in database
    const user = await this.userRepository.createOrUpdateHHUser({
      hhUserId: userInfo.id,
      email: userInfo.email,
      firstName: userInfo.first_name,
      lastName: userInfo.last_name,
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      tokenExpiresAt: Date.now() + tokenData.expires_in * 1000,
    })

    return user
  }

  async refreshToken(userId: string): Promise<{ accessToken: string }> {
    // Get user from database
    const user = await this.userRepository.findById(userId)

    if (!user.refreshToken) {
      throw new BadRequestError('Refresh token not found for user')
    }

    if (user.tokenExpiresAt && Date.now() < user.tokenExpiresAt) {
      return { accessToken: user.accessToken! }
    }

    // Refresh token
    const tokenData = await this.hhApiService.refreshAccessToken(
      user.refreshToken
    )

    // Update tokens in database
    await this.userRepository.updateTokens(
      userId,
      tokenData.access_token,
      tokenData.refresh_token,
      Date.now() + tokenData.expires_in * 1000
    )

    return { accessToken: tokenData.access_token }
  }
}
