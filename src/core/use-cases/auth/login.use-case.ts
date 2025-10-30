import { IAuthRepository } from '../../domain/interfaces/repositories'
import { User, LoginCredentials, RegisterData, AuthResponse } from '../../domain/types'

export class LoginUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(credentials: LoginCredentials): Promise<AuthResponse> {
    return this.authRepository.login(credentials)
  }
}

export class RegisterUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(data: RegisterData): Promise<AuthResponse> {
    return this.authRepository.register(data)
  }
}

export class LogoutUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(): Promise<void> {
    return this.authRepository.logout()
  }
}

export class GetCurrentUserUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(): Promise<User | null> {
    return this.authRepository.getCurrentUser()
  }
}

export class RefreshTokenUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(): Promise<AuthResponse> {
    return this.authRepository.refreshToken()
  }
}

export class CheckUsernameUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(username: string): Promise<boolean> {
    return this.authRepository.checkUsername(username)
  }
}

export class CheckEmailUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(email: string): Promise<boolean> {
    return this.authRepository.checkEmail(email)
  }
}

export class CheckTelephoneUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(telephone: string): Promise<boolean> {
    return this.authRepository.checkTelephone(telephone)
  }
}

export class CheckNumeroEnrUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(numeroEnr: string): Promise<boolean> {
    return this.authRepository.checkNumeroEnr(numeroEnr)
  }
}


