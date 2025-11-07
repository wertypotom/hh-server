import { db } from '@config/firebase.config'
import { User, CreateUserDto, HHUser } from './user.types'
import { NotFoundError } from '@utils/errors'

export class UserRepository {
  private collection = db.collection('users')

  async create(userData: CreateUserDto): Promise<User> {
    const docRef = await this.collection.add({
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const doc = await docRef.get()
    return { id: doc.id, ...doc.data() } as User
  }

  async findAll(): Promise<User[]> {
    const snapshot = await this.collection.get()
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as User))
  }

  async findById(id: string): Promise<User> {
    const doc = await this.collection.doc(id).get()

    if (!doc.exists) {
      throw new NotFoundError(`User with id ${id} not found`)
    }

    return { id: doc.id, ...doc.data() } as User
  }

  async createOrUpdateHHUser(hhUser: HHUser): Promise<User> {
    const userRef = this.collection.doc(hhUser.hhUserId)

    await userRef.set(
      {
        ...hhUser,
        updatedAt: new Date(),
      },
      { merge: true }
    )

    const doc = await userRef.get()
    return { id: doc.id, ...doc.data() } as User
  }

  async updateTokens(
    userId: string,
    accessToken: string,
    refreshToken: string,
    expiresAt: number
  ): Promise<void> {
    await this.collection.doc(userId).update({
      accessToken,
      refreshToken,
      tokenExpiresAt: expiresAt,
      updatedAt: new Date(),
    })
  }
}
