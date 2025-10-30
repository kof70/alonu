import { API_CONFIG, getAuthHeaders } from '../config/api.config';

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
  status: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

class ApiClient {
  private baseURL: string;
  private authToken: string | null = null;

  constructor() {
    this.baseURL = API_CONFIG.baseURL;
  }

  setAuthToken(token: string | null) {
    this.authToken = token;
  }

  private async getAuthToken(): Promise<string | null> {
    // 1. Vérifier le cache mémoire d'abord (plus rapide)
    if (this.authToken) {
      return this.authToken;
    }

    try {
      // 2. Vérifier le cache localStorage (rapide)
      const cachedToken = localStorage.getItem('alonu_auth_token');
      const tokenTimestamp = localStorage.getItem('alonu_auth_timestamp');
      
      if (cachedToken && tokenTimestamp) {
        const now = Date.now();
        const tokenAge = now - parseInt(tokenTimestamp);
        const TOKEN_DURATION = 60 * 60 * 1000; // 1 heure (plus long)
        
        if (tokenAge < TOKEN_DURATION) {
          console.log('🚀 Token en cache - retour immédiat');
          this.authToken = cachedToken;
          return this.authToken;
        } else {
          console.log('⏰ Token expiré - nettoyage du cache');
          localStorage.removeItem('alonu_auth_token');
          localStorage.removeItem('alonu_auth_timestamp');
        }
      }

      // 3. Authentification seulement si nécessaire
      console.log('🔐 Authentification nécessaire...');
      const authStart = performance.now();
      
      const response = await fetch(`${this.baseURL}/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'sysadmin',
          password: '@sys@#123'
        })
      });

      if (response.ok) {
        const data = await response.json();
        this.authToken = data.accessToken;
        
        // Mettre en cache pour 1 heure
        localStorage.setItem('alonu_auth_token', this.authToken);
        localStorage.setItem('alonu_auth_timestamp', Date.now().toString());
        
        const authTime = performance.now() - authStart;
        console.log(`✅ Authentification: ${authTime.toFixed(2)}ms (mise en cache 1h)`);
        return this.authToken;
      }
    } catch (error) {
      console.error('Erreur d\'authentification:', error);
    }

    return null;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    // Obtenir le token d'authentification quand nécessaire
    let token = this.authToken;
    if (!token) {
      const isCheck = endpoint.includes('/check_');
      const isAuthEndpoint = endpoint.includes('/auth/');
      const isSubcatAuth = endpoint.includes('/auth/sous_categorie');
      // Fournir un token pour: sous-catégories protégées, endpoints check_ et tout endpoint hors /auth
      const needsToken = isSubcatAuth || isCheck || !isAuthEndpoint;
      if (needsToken) {
        token = await this.getAuthToken();
      }
    }
    
    const config: RequestInit = {
      ...options,
      headers: {
        ...getAuthHeaders(token || undefined),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `HTTP error! status: ${response.status}`;
        
        try {
          const errorData = JSON.parse(errorText);
          // API format with apierror and subErrors
          const apiErr = errorData.apierror || errorData;
          if (apiErr) {
            const mainMsg = apiErr.message || apiErr.error || apiErr.title || '';
            const sub = Array.isArray(apiErr.subErrors) ? apiErr.subErrors : [];
            const details = sub
              .map((e: any) => {
                const field = e.field || e.object || 'champ';
                const rejected = e.rejectedValue !== undefined ? ` (valeur: ${e.rejectedValue})` : '';
                const msg = e.message || e.defaultMessage || 'invalide';
                return `- ${field}${rejected}: ${msg}`;
              })
              .join('\n');
            errorMessage = [mainMsg || errorMessage, details].filter(Boolean).join('\n');
          } else {
            errorMessage = errorData.message || errorData.error || errorMessage;
          }
        } catch {
          // Si ce n'est pas du JSON, utiliser le texte brut
          errorMessage = errorText || errorMessage;
        }
        
        throw new Error(errorMessage);
      }

      // Gérer les réponses sans corps (201/204 ou corps vide)
      let data: any = null;
      const contentType = response.headers.get('content-type') || '';
      const contentLength = response.headers.get('content-length');

      if (response.status === 204 || contentLength === '0') {
        data = {} as any;
      } else if (contentType.includes('application/json')) {
        try {
          data = await response.json();
        } catch {
          // Corps vide malgré 2xx: retourner objet vide
          data = {} as any;
        }
      } else {
        // Non-JSON: tenter texte, sinon objet vide
        try {
          const text = await response.text();
          data = text ? (text as any) : ({} as any);
        } catch {
          data = {} as any;
        }
      }

      return {
        data: data as T,
        success: true,
        status: response.status,
      };
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async get<T>(endpoint: string, token?: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'GET',
      headers: token ? getAuthHeaders(token) : undefined,
    });
  }

  async post<T>(
    endpoint: string,
    data?: any,
    token?: string
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      headers: token ? getAuthHeaders(token) : undefined,
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(
    endpoint: string,
    data?: any,
    token?: string
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      headers: token ? getAuthHeaders(token) : undefined,
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string, token?: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
      headers: token ? getAuthHeaders(token) : undefined,
    });
  }
}

export const apiClient = new ApiClient();
