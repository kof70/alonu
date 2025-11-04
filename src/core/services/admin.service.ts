import { UsersApi } from '@/infrastructure/api/users.api'

export const fetchAdmins = () => UsersApi.getAdmins()
export const fetchAgents = () => UsersApi.getAgents()
export const fetchUsers = () => UsersApi.getNotDeleted()
export const updateCurrentUser = (payload: { username?: string; email?: string; nom?: string; prenom?: string }) =>
  UsersApi.updateCurrent(payload)
export const checkEmailAvailability = (email: string) => UsersApi.checkEmail(email)
export const checkUsernameAvailability = (username: string) => UsersApi.checkUsername(username)


