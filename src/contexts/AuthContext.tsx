import React, { createContext, useContext, useState, useEffect } from 'react'
import { User, LoginCredentials, RegisterData, AuthResponse } from '../core/domain/types'
import { AuthRepository } from '../infrastructure/repositories/auth.repository'
import { 
  LoginUseCase, 
  RegisterUseCase, 
  LogoutUseCase, 
  GetCurrentUserUseCase,
  RefreshTokenUseCase,
  CheckUsernameUseCase,
  CheckEmailUseCase,
  CheckTelephoneUseCase,
  CheckNumeroEnrUseCase
} from '../core/use-cases/auth/login.use-case'

interface AuthContextType {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
  checkUsername: (username: string) => Promise<boolean>
  checkEmail: (email: string) => Promise<boolean>
  checkTelephone: (telephone: string) => Promise<boolean>
  checkNumeroEnr: (numeroEnr: string) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [refreshToken, setRefreshToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Initialiser les use cases
  const authRepository = new AuthRepository()
  const loginUseCase = new LoginUseCase(authRepository)
  const registerUseCase = new RegisterUseCase(authRepository)
  const logoutUseCase = new LogoutUseCase(authRepository)
  const getCurrentUserUseCase = new GetCurrentUserUseCase(authRepository)
  const refreshTokenUseCase = new RefreshTokenUseCase(authRepository)
  const checkUsernameUseCase = new CheckUsernameUseCase(authRepository)
  const checkEmailUseCase = new CheckEmailUseCase(authRepository)
  const checkTelephoneUseCase = new CheckTelephoneUseCase(authRepository)
  const checkNumeroEnrUseCase = new CheckNumeroEnrUseCase(authRepository)

  useEffect(() => {
    // Vérifier les tokens stockés au montage
    const initializeAuth = async () => {
      setIsLoading(true)
      try {
        const storedAccessToken = localStorage.getItem('accessToken')
        const storedRefreshToken = localStorage.getItem('refreshToken')
    const storedUser = localStorage.getItem('user')
    
        if (storedAccessToken && storedRefreshToken && storedUser) {
          setAccessToken(storedAccessToken)
          setRefreshToken(storedRefreshToken)
      setUser(JSON.parse(storedUser))
        } else {
          // Essayer de récupérer l'utilisateur actuel
          const currentUser = await getCurrentUserUseCase.execute()
          if (currentUser) {
            setUser(currentUser)
          }
        }
      } catch (error) {
        console.error('Erreur lors de l\'initialisation de l\'authentification:', error)
        // Nettoyer les données corrompues
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const login = async (credentials: LoginCredentials): Promise<void> => {
    setIsLoading(true)
    try {
      const response = await loginUseCase.execute(credentials)
      setUser(response.user)
      setAccessToken(response.accessToken)
      setRefreshToken(response.refreshToken)
    } catch (error) {
      console.error('Erreur lors de la connexion:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (data: RegisterData): Promise<void> => {
    setIsLoading(true)
    try {
      const response = await registerUseCase.execute(data)
      
      // Si l'inscription retourne les tokens, les utiliser directement
      if (response.accessToken && response.refreshToken && response.user) {
        setUser(response.user)
        setAccessToken(response.accessToken)
        setRefreshToken(response.refreshToken)
      } else {
        // Sinon, connecter automatiquement l'utilisateur après inscription
        console.log('Inscription réussie, connexion automatique en cours...')
        await login({
          username: data.username,
          password: data.password
        })
      }
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async (): Promise<void> => {
    setIsLoading(true)
    try {
      await logoutUseCase.execute()
    setUser(null)
      setAccessToken(null)
      setRefreshToken(null)
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const checkUsername = async (username: string): Promise<boolean> => {
    try {
      return await checkUsernameUseCase.execute(username)
    } catch (error) {
      console.error('Erreur lors de la vérification du nom d\'utilisateur:', error)
      return false
    }
  }

  const checkEmail = async (email: string): Promise<boolean> => {
    try {
      return await checkEmailUseCase.execute(email)
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'email:', error)
      return false
    }
  }

  const checkTelephone = async (telephone: string): Promise<boolean> => {
    try {
      return await checkTelephoneUseCase.execute(telephone)
    } catch (error) {
      console.error('Erreur lors de la vérification du téléphone:', error)
      return false
    }
  }

  const checkNumeroEnr = async (numeroEnr: string): Promise<boolean> => {
    try {
      return await checkNumeroEnrUseCase.execute(numeroEnr)
    } catch (error) {
      console.error('Erreur lors de la vérification du numéro d\'enregistrement:', error)
      return false
    }
  }

  const value = {
    user,
    accessToken,
    refreshToken,
    isLoading,
    isAuthenticated: !!accessToken && !!user,
    login,
    register,
    logout,
    checkUsername,
    checkEmail,
    checkTelephone,
    checkNumeroEnr
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}











