// Mock hooks for now - will be implemented based on your API
export const useLogin = () => {
  return {
    mutateAsync: async (credentials: { username: string; password: string }) => {
      // Mock login - replace with actual API call
      if (credentials.username === 'admin' && credentials.password === 'admin') {
        return {
          accessToken: 'mock-token',
          refreshToken: 'mock-refresh-token',
          user: { role: 1, username: credentials.username }
        }
      }
      throw new Error('Identifiants invalides')
    }
  }
}











