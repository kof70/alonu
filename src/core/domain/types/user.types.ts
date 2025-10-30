export interface User {
  id: string
  username: string
  email: string
  nom: string
  prenom: string
  role: number
  telephone?: string
  adresse?: string
  numeroEnr?: string
  facebook?: string
  whatsapp?: string
  tweeter?: string
  longitude?: number
  latitude?: number
  latidute?: number  // Erreur de frappe dans l'API
  sousCategories?: number
  createdAt?: Date
  updatedAt?: Date
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  accessToken: string | null
  refreshToken: string | null
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface RegisterData {
  username: string
  password: string
  email: string
  nom: string
  prenom: string
  telephone: string
  adresse: string
  numeroEnr: string
  facebook?: string
  whatsapp?: string
  tweeter?: string
  longitude?: number
  latitude?: number
  latidute?: number  // Erreur de frappe dans l'API
  sousCategories: number
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: User
}

export interface RefreshTokenRequest {
  refreshToken: string
}


