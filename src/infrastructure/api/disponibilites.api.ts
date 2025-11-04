import { apiClient } from './api.client'

export type DisponibilitesPayload = {
  joursSemaine: string[]
  plagesHoraires: Array<{ debut: string; fin: string }>
  mois?: number[]
  commentaire?: string
}

export const DisponibilitesApi = {
  getForUser: (userId: number | string) =>
    apiClient.get<DisponibilitesPayload | null>(`/etudiants/${userId}/disponibilites`),

  updateForUser: (userId: number | string, payload: DisponibilitesPayload) =>
    apiClient.put<DisponibilitesPayload>(`/etudiants/${userId}/disponibilites`, payload),
}


