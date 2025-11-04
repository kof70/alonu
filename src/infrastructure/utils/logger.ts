// Logger utilitaire qui masque TOUS les logs en production
const isProduction = import.meta.env.MODE === 'production' || import.meta.env.PROD;

export const logger = {
  log: (...args: any[]) => {
    // Silence total en production
    if (!isProduction) {
      console.log(...args);
    }
  },
  
  error: (...args: any[]) => {
    // Silence total en production - aucune erreur dans la console
    if (!isProduction) {
      console.error(...args);
    }
    // En production : ne rien afficher du tout
  },
  
  warn: (...args: any[]) => {
    // Silence total en production
    if (!isProduction) {
      console.warn(...args);
    }
  },
  
  info: (...args: any[]) => {
    // Silence total en production
    if (!isProduction) {
      console.info(...args);
    }
  },
};

