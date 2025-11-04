import { apiClient } from './api.client'

export const UsersApi = {
  getAdmins: () => apiClient.get<any[]>('/users_admin'),
  getAgents: () => apiClient.get<any[]>('/users_agent'),
  getNotDeleted: () => apiClient.get<any[]>('/users_not_deleted'),
  getDeleted: () => apiClient.get<any[]>('/users_deleted'),

  checkEmail: (email: string) => apiClient.get<boolean>(`/check_email_up/${encodeURIComponent(email)}`),
  checkUsername: (username: string) => apiClient.get<boolean>(`/check_username_up/${encodeURIComponent(username)}`),

  updateCurrent: (payload: { username?: string; email?: string; nom?: string; prenom?: string }) =>
    apiClient.put<any>('/users_current', payload),
}


