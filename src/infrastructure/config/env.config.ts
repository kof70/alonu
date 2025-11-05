// Configuration de l'environnement
const getApiBaseUrl = (): string => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  
  if (envUrl) {
    return envUrl;
  }
  
  // Toujours utiliser HTTP pour éviter les problèmes Mixed Content
  return 'http://51.75.162.85:8080/artisanat_v8/api';
};

export const ENV_CONFIG = {
  API_BASE_URL: getApiBaseUrl(),
  APP_NAME: import.meta.env.VITE_APP_NAME || 'ALONU',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  NODE_ENV: import.meta.env.MODE || 'development',
  PUBLIC_BEARER_TOKEN: import.meta.env.VITE_PUBLIC_BEARER_TOKEN || '',
};

// Validation de la configuration
if (!ENV_CONFIG.API_BASE_URL) {
  console.warn('VITE_API_BASE_URL n\'est pas défini. Utilisation de l\'URL par défaut.');
}
