import { apiClient } from './api.client'

export interface RealisationDto {
  id: number
  titre: string
  description?: string
  images?: string[]
  createdAt?: string
}

export const RealisationsApi = {
  // Endpoints trouvés dans la collection Postman du repo
  getByArtisan: (artisanId: number | string) => apiClient.get<RealisationDto[]>(`/realisations_art/${artisanId}`),
  getByUser: (userId: number | string) => apiClient.get<RealisationDto[]>(`/realisations_user/${userId}`),
}


