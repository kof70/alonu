import { apiClient } from './api.client'

export const ArtisansAdminApi = {
  getAll: () => apiClient.get<any[]>('/artisans'),
  getNotDeleted: () => apiClient.get<any[]>('/artisans_not_deleted'),
  getDeleted: () => apiClient.get<any[]>('/artisans_deleted'),
  getPage: (page: number) => apiClient.get<any[]>(`/artisans_pages/${page}`),
  searchPage: (page: number, term: string) => apiClient.get<any[]>(`/artisans_search_page/${page}/${encodeURIComponent(term)}`),
  getLastPremium: () => apiClient.get<any[]>('/auth/artisans_last_premium'),
  activateBatch: (ids: Array<number|string>) => apiClient.put<any>('/artisans_active', ids),
  deactivateBatch: (ids: Array<number|string>) => apiClient.put<any>('/artisans_desactive', ids),
}


