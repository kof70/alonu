import { API_CONFIG, getAuthHeaders } from '../config/api.config';
import { logger } from '../utils/logger';

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
  private authInProgress: boolean = false;
  private authFailed: boolean = false;
  private authFailureCount: number = 0;
  private readonly MAX_AUTH_ATTEMPTS = 3;

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

    // 2. Vérifier le cache localStorage (rapide)
    let cachedToken = localStorage.getItem('alonu_auth_token');
    const tokenTimestamp = localStorage.getItem('alonu_auth_timestamp');
    
    if (cachedToken && tokenTimestamp) {
      const now = Date.now();
      const tokenAge = now - parseInt(tokenTimestamp);
      const TOKEN_DURATION = 60 * 60 * 1000; // 1 heure (plus long)
      
      if (tokenAge < TOKEN_DURATION) {
        logger.log('🚀 Token en cache - retour immédiat');
        this.authToken = cachedToken;
        return this.authToken;
      } else {
        logger.log('⏰ Token expiré - nettoyage du cache');
        localStorage.removeItem('alonu_auth_token');
        localStorage.removeItem('alonu_auth_timestamp');
      }
    }

    // 2b. Fallback: utiliser un accessToken existant si présent (cohérence avec AuthContext)
    const storedAccessToken = localStorage.getItem('accessToken');
    if (storedAccessToken) {
      this.authToken = storedAccessToken;
      // Optionnel: aligner le cache pour 1h si timestamp absent
      if (!localStorage.getItem('alonu_auth_timestamp')) {
        localStorage.setItem('alonu_auth_token', storedAccessToken);
        localStorage.setItem('alonu_auth_timestamp', Date.now().toString());
      }
      return this.authToken;
    }

    // 3. Authentification seulement si nécessaire et si pas déjà en cours
    if (this.authInProgress || this.authFailed) {
      return null;
    }

    // Vérifier le nombre de tentatives
    if (this.authFailureCount >= this.MAX_AUTH_ATTEMPTS) {
      this.authFailed = true;
      logger.warn('⚠️ Trop de tentatives d\'authentification, arrêt des tentatives');
      return null;
    }

    this.authInProgress = true;
    this.authFailureCount++;

    try {
      logger.log('🔐 Tentative d\'authentification automatique...');
      const authStart = performance.now();
      
      const requestBody = {
        username: 'sysadmin',
        password: '@sys@#123'
      };
      
      const response = await fetch(`${this.baseURL}/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      logger.log(`📥 Réponse authentification: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        const data = await response.json();
        logger.log('📦 Données reçues:', { 
          hasAccessToken: !!data.accessToken, 
          hasToken: !!data.token,
          keys: Object.keys(data)
        });
        
        this.authToken = data.accessToken || data.token;
        
        if (this.authToken) {
          // Mettre en cache pour 1 heure
          localStorage.setItem('alonu_auth_token', this.authToken);
          localStorage.setItem('alonu_auth_timestamp', Date.now().toString());
          
          // Réinitialiser les compteurs en cas de succès
          this.authFailed = false;
          this.authFailureCount = 0;
          
          const authTime = performance.now() - authStart;
          logger.log(`✅ Authentification réussie: ${authTime.toFixed(2)}ms (mise en cache 1h)`);
          return this.authToken;
        } else {
          logger.error('❌ Token non trouvé dans la réponse');
        }
      } else {
        // En production, ne pas logger les détails d'erreur
        logger.error(`❌ Authentification automatique échouée (${response.status})`);
        logger.warn('ℹ️ Les endpoints publics continueront de fonctionner sans authentification');
      }
    } catch (error) {
      logger.warn('⚠️ Erreur lors de l\'authentification automatique');
      logger.warn('ℹ️ Les endpoints publics continueront de fonctionner sans authentification');
    } finally {
      this.authInProgress = false;
    }

    return null;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    // Déterminer si l'endpoint nécessite une authentification
    const isCheck = endpoint.includes('/check_');
    const isAuthEndpoint = endpoint.includes('/auth/');
    const isSubcatAuth = endpoint.includes('/auth/sous_categorie');
    
    // Essayer d'obtenir un token seulement si nécessaire
    let token = this.authToken;
    if (!token) {
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
      // Intercepter les erreurs fetch pour éviter les logs natives du navigateur en production
      const isProduction = import.meta.env.MODE === 'production';
      let response: Response;
      
      try {
        response = await fetch(url, config);
      } catch (fetchError) {
        // En production, masquer les erreurs réseau natives
        if (isProduction) {
          logger.error('Network error');
          throw new Error('Network error');
        }
        throw fetchError;
      }
      
      // Si 401 et qu'on avait un token, essayer sans token (endpoint potentiellement public)
      if (!response.ok && response.status === 401 && token && !isAuthEndpoint) {
        logger.warn(`⚠️ Requête refusée avec token (401), tentative sans authentification pour: ${endpoint}`);
        const retryConfig: RequestInit = {
          ...options,
          headers: {
            ...API_CONFIG.headers,
            ...options.headers,
          },
        };
        let retryResponse: Response;
        try {
          retryResponse = await fetch(url, retryConfig);
        } catch (retryError) {
          if (isProduction) {
            logger.error('Network error');
            throw new Error('Network error');
          }
          throw retryError;
        }
        if (retryResponse.ok) {
          // Endpoint public, continuer avec la réponse
          const retryData = await this.parseResponse(retryResponse);
          return {
            data: retryData,
            success: true,
            status: retryResponse.status,
          };
        }
        // Si toujours 401, utiliser la réponse originale
        response = retryResponse;
      }
      
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

      const data = await this.parseResponse(response);

      return {
        data: data as T,
        success: true,
        status: response.status,
      };
    } catch (error) {
      logger.error('API request failed:', error);
      // En production, masquer les détails techniques
      const isProduction = import.meta.env.MODE === 'production';
      if (isProduction && error instanceof Error) {
        // Créer une erreur générique sans détails techniques
        const genericError = new Error('Une erreur est survenue');
        genericError.name = error.name;
        throw genericError;
      }
      throw error;
    }
  }

  private async parseResponse(response: Response): Promise<any> {
    // Gérer les réponses sans corps (201/204 ou corps vide)
    const contentType = response.headers.get('content-type') || '';
    const contentLength = response.headers.get('content-length');

    if (response.status === 204 || contentLength === '0') {
      return {} as any;
    } else if (contentType.includes('application/json')) {
      try {
        return await response.json();
      } catch {
        // Corps vide malgré 2xx: retourner objet vide
        return {} as any;
      }
    } else {
      // Non-JSON: tenter texte, sinon objet vide
      try {
        const text = await response.text();
        return text ? (text as any) : ({} as any);
      } catch {
        return {} as any;
      }
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
