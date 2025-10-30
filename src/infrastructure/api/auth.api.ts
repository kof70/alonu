import { apiClient } from './api.client'
import { 
  LoginCredentials, 
  RegisterData, 
  AuthResponse, 
  RefreshTokenRequest 
} from '../../core/domain/types/user.types'

export class AuthApi {
  private readonly baseUrl = '/auth'

  /**
   * Connexion d'un utilisateur (artisan ou étudiant)
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post(`${this.baseUrl}/signin_web`, credentials)
    return response.data
  }

  /**
   * Inscription d'un nouvel utilisateur (artisan ou étudiant)
   * Tente /signin-up-all, sinon bascule sur /signin-up-all-check si 500.
   */
  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/signin-up-all`, userData)
      return response.data
    } catch (err) {
      // Fallback si l'API d'inscription principale échoue (erreur serveur)
      const response = await apiClient.post(`${this.baseUrl}/signin-up-all-check`, userData)
      return response.data
    }
  }

  /**
   * Rafraîchissement du token d'accès
   */
  async refreshToken(refreshToken: RefreshTokenRequest): Promise<AuthResponse> {
    const response = await apiClient.post(`${this.baseUrl}/refreshtoken`, refreshToken)
    return response.data
  }

  /**
   * Vérification de la disponibilité d'un nom d'utilisateur
   */
  async checkUsername(username: string): Promise<boolean> {
    try {
      const response = await apiClient.get(`/check_username_up/${username}`)
      return response.status === 200
    } catch (error) {
      return false
    }
  }

  /**
   * Vérification de la disponibilité d'un email
   */
  async checkEmail(email: string): Promise<boolean> {
    try {
      const response = await apiClient.get(`/check_email_up/${email}`)
      return response.status === 200
    } catch (error) {
      return false
    }
  }

  /**
   * Vérification de la disponibilité d'un numéro de téléphone
   */
  async checkTelephone(telephone: string): Promise<boolean> {
    try {
      const response = await apiClient.get(`/check_telephone_up/${telephone}`)
      return response.status === 200
    } catch (error) {
      return false
    }
  }

  /**
   * Vérification de la disponibilité d'un numéro d'enregistrement
   */
  async checkNumeroEnr(numeroEnr: string): Promise<boolean> {
    try {
      const response = await apiClient.get(`/check_num_enr_up/${numeroEnr}`)
      return response.status === 200
    } catch (error) {
      return false
    }
  }
}

export const authApi = new AuthApi()

