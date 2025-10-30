import { User, LoginCredentials, RegisterData, AuthResponse } from '../../types'

export interface IAuthRepository {
  login(credentials: LoginCredentials): Promise<AuthResponse>
  register(data: RegisterData): Promise<AuthResponse>
  logout(): Promise<void>
  getCurrentUser(): Promise<User | null>
  refreshToken(): Promise<AuthResponse>
  checkUsername(username: string): Promise<boolean>
  checkEmail(email: string): Promise<boolean>
  checkTelephone(telephone: string): Promise<boolean>
  checkNumeroEnr(numeroEnr: string): Promise<boolean>
}


