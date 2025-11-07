import { UserRepository } from './user.repository'
import { User, CreateUserDto } from './user.types'

export class UserService {
  private userRepository: UserRepository

  constructor() {
    this.userRepository = new UserRepository()
  }

  async createUser(userData: CreateUserDto): Promise<User> {
    return await this.userRepository.create(userData)
  }

  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.findAll()
  }

  async getUserById(id: string): Promise<User> {
    return await this.userRepository.findById(id)
  }
}
