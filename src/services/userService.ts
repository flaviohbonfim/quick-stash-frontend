import api from '@/lib/api'
import type { User } from '@/types/auth'

export const userService = {
  async getUser(): Promise<User> {
    const response = await api.get<User>('/users')
    return response.data
  },

  async getUserById(id: string): Promise<User> {
    const response = await api.get<User>(`/users/${id}`)
    return response.data
  },

  async updateUser(data: Partial<User>): Promise<User> {
    const response = await api.put<User>('/users', data)
    return response.data
  },
}
