import { IAuthRepository } from '../../core/domain/interfaces/repositories'
import { 
  User, 
  LoginCredentials, 
  RegisterData, 
  AuthResponse, 
  RefreshTokenRequest 
} from '../../core/domain/types'
import { authApi } from '../api/auth.api'

export class AuthRepository implements IAuthRepository {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await authApi.login(credentials)
      
      // Stocker les tokens dans le localStorage
      localStorage.setItem('accessToken', response.accessToken)
      localStorage.setItem('refreshToken', response.refreshToken)
      localStorage.setItem('user', JSON.stringify(response.user))
      
      return response
    } catch (error) {
      console.error('Erreur lors de la connexion:', error)
      throw new Error('Échec de la connexion. Vérifiez vos identifiants.')
    }
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      // L'API attend directement les données telles quelles (avec "latidute")
      const response = await authApi.register(data)
      
      // Stocker les tokens dans le localStorage
      localStorage.setItem('accessToken', response.accessToken)
      localStorage.setItem('refreshToken', response.refreshToken)
      localStorage.setItem('user', JSON.stringify(response.user))
      
      return response
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error)
      throw new Error('Échec de l\'inscription. Vérifiez vos informations.')
    }
  }

  async logout(): Promise<void> {
    try {
      // Supprimer les tokens du localStorage
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const userStr = localStorage.getItem('user')
      if (!userStr) return null
      
      return JSON.parse(userStr)
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error)
      return null
    }
  }

  async refreshToken(): Promise<AuthResponse> {
    try {
      const refreshToken = localStorage.getItem('refreshToken')
      if (!refreshToken) {
        throw new Error('Aucun token de rafraîchissement disponible')
      }

      const response = await authApi.refreshToken({ refreshToken })
      
      // Mettre à jour les tokens dans le localStorage
      localStorage.setItem('accessToken', response.accessToken)
      localStorage.setItem('refreshToken', response.refreshToken)
      localStorage.setItem('user', JSON.stringify(response.user))
      
      return response
    } catch (error) {
      console.error('Erreur lors du rafraîchissement du token:', error)
      // En cas d'erreur, déconnecter l'utilisateur
      await this.logout()
      throw new Error('Session expirée. Veuillez vous reconnecter.')
    }
  }

  async checkUsername(username: string): Promise<boolean> {
    try {
      return await authApi.checkUsername(username)
    } catch (error) {
      console.error('Erreur lors de la vérification du nom d\'utilisateur:', error)
      return false
    }
  }

  async checkEmail(email: string): Promise<boolean> {
    try {
      return await authApi.checkEmail(email)
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'email:', error)
      return false
    }
  }

  async checkTelephone(telephone: string): Promise<boolean> {
    try {
      return await authApi.checkTelephone(telephone)
    } catch (error) {
      console.error('Erreur lors de la vérification du téléphone:', error)
      return false
    }
  }

  async checkNumeroEnr(numeroEnr: string): Promise<boolean> {
    try {
      return await authApi.checkNumeroEnr(numeroEnr)
    } catch (error) {
      console.error('Erreur lors de la vérification du numéro d\'enregistrement:', error)
      return false
    }
  }
}


