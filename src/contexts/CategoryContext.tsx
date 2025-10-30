import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Category } from '@/data/mockData';
import { categoryService } from '@/core/services/category.service';

interface CategoryContextType {
  categories: Category[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

const STORAGE_KEY = 'alonu_categories_cache';
const CACHE_EXPIRY_KEY = 'alonu_categories_cache_expiry';
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes en localStorage

export const CategoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger depuis localStorage si disponible et valide
  const loadFromCache = (): Category[] | null => {
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      const expiry = localStorage.getItem(CACHE_EXPIRY_KEY);
      
      if (cached && expiry) {
        const expiryTime = parseInt(expiry);
        if (Date.now() < expiryTime) {
          console.log('📦 Chargement des catégories depuis le cache localStorage');
          return JSON.parse(cached);
        } else {
          console.log('⏰ Cache localStorage expiré');
          localStorage.removeItem(STORAGE_KEY);
          localStorage.removeItem(CACHE_EXPIRY_KEY);
        }
      }
    } catch (err) {
      console.error('Erreur lors du chargement du cache:', err);
    }
    return null;
  };

  // Sauvegarder dans localStorage
  const saveToCache = (data: Category[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      localStorage.setItem(CACHE_EXPIRY_KEY, (Date.now() + CACHE_DURATION).toString());
      console.log('💾 Catégories sauvegardées dans le cache localStorage');
    } catch (err) {
      console.error('Erreur lors de la sauvegarde du cache:', err);
    }
  };

  // Charger les catégories
  const fetchCategories = async (silent: boolean = false) => {
    try {
      if (!silent) {
        setLoading(true);
      }
      setError(null);
      
      const data = await categoryService.getAllCategories();
      
      setCategories(data);
      saveToCache(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement des catégories';
      setError(errorMessage);
      console.error('Error fetching categories:', err);
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  };

  // Initialisation
  useEffect(() => {
    const initCategories = async () => {
      // 1. Essayer de charger depuis le cache
      const cachedCategories = loadFromCache();
      
      if (cachedCategories && cachedCategories.length > 0) {
        // Afficher immédiatement les données en cache
        setCategories(cachedCategories);
        setLoading(false);
        
        // Rafraîchir en arrière-plan
        console.log('🔄 Rafraîchissement des catégories en arrière-plan...');
        await fetchCategories(true);
      } else {
        // Pas de cache, chargement normal
        await fetchCategories(false);
      }
    };

    initCategories();
  }, []);

  const refetch = async () => {
    categoryService.clearCache();
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(CACHE_EXPIRY_KEY);
    await fetchCategories(false);
  };

  return (
    <CategoryContext.Provider value={{ categories, loading, error, refetch }}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategoriesContext = () => {
  const context = useContext(CategoryContext);
  if (context === undefined) {
    throw new Error('useCategoriesContext doit être utilisé à l\'intérieur d\'un CategoryProvider');
  }
  return context;
};

