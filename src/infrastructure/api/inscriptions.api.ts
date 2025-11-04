import { apiClient } from './api.client'

export const InscriptionsApi = {
  getNotDeleted: () => apiClient.get<any[]>('/inscription_projets_not_deleted'),
  getPage: (page: number) => apiClient.get<any[]>(`/inscription_projets_pages/${page}`),
  searchPage: (page: number, term: string) => apiClient.get<any[]>(`/search_inscription_projets/${page}/${encodeURIComponent(term)}`),
  getCount: () => apiClient.get<number>('/inscription_projets_count'),
  getByCategory: (categorieId: number | string) => apiClient.get<any[]>(`/inscription_projets_by_cat/${categorieId}`),
  getByArtisan: (artisanId: number | string) => apiClient.get<any[]>(`/inscription_projets/by_artisan/${artisanId}`),
  create: (payload: Record<string, any>) => apiClient.post<any>('/inscription_projets', payload),
  assigner: (inscriptionId: number | string, artisanId: number | string) => 
    apiClient.put<any>(`/inscription_projets/${inscriptionId}/assigner`, { artisanId }),
}


