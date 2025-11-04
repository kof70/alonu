import { Category } from '@/data/mockData';
import { categoryApiService, SubcategoryApiResponse } from '@/infrastructure/api/category.api';
import { apiClient } from '@/infrastructure/api/api.client';
import { ENV_CONFIG } from '@/infrastructure/config/env.config';
import { CategoryMapper } from '@/infrastructure/mappers/category.mapper';
import { logger } from '@/infrastructure/utils/logger';

export class CategoryService {
  private categoriesCache: Category[] | null = null;
  private cacheTimestamp: number = 0;
  private CACHE_DURATION = 10 * 60 * 1000; // 10 minutes
  private subcategoriesCache: SubcategoryApiResponse[] | null = null;

  async getAllCategories(): Promise<Category[]> {
    try {
      // Vérifier le cache avec timestamp
      const now = Date.now();
      if (this.categoriesCache && (now - this.cacheTimestamp) < this.CACHE_DURATION) {
        logger.log('🚀 Utilisation du cache pour les catégories');
        return this.categoriesCache;
      }

      // Récupérer les catégories et sous-catégories avec fallbacks
      const [apiCategories, apiSubcategories] = await Promise.all([
        // Catégories: essayer not_deleted -> all
        (async () => {
          try {
            const res = await apiClient.get<any>('/categorie_not_deleted');
            return Array.isArray(res.data) ? res.data : (res.data?.data || []);
          } catch {
            const list = await categoryApiService.getAllCategories();
            return list;
          }
        })(),
        // Sous-catégories: essayer auth -> not_deleted -> all
        (async () => {
          // Token public éventuel
          const tokenFromStorage = (typeof localStorage !== 'undefined') ? (localStorage.getItem('accessToken') || undefined) : undefined;
          const fallbackToken = (ENV_CONFIG as any).PUBLIC_BEARER_TOKEN || undefined;
          const authToken = tokenFromStorage || fallbackToken;
          try {
            if (authToken) {
              const res = await apiClient.get<any>('/auth/sous_categorie_auth', authToken);
              const list = Array.isArray(res.data) ? res.data : (res.data?.data || []);
              if (list?.length) return list as SubcategoryApiResponse[];
            }
          } catch {}
          try {
            const res = await apiClient.get<any>('/sous_categorie_not_deleted');
            const list = Array.isArray(res.data) ? res.data : (res.data?.data || []);
            if (list?.length) return list as SubcategoryApiResponse[];
          } catch {}
          // Fallback final
          return await categoryApiService.getAllSubcategories();
        })(),
      ]);

      // Mapper les données
      const categories = CategoryMapper.mapApiToCategories(apiCategories, apiSubcategories);
      
      // Mettre en cache avec timestamp
      this.categoriesCache = categories;
      this.subcategoriesCache = apiSubcategories as SubcategoryApiResponse[];
      this.cacheTimestamp = now;

      return categories;
    } catch (error) {
      logger.error('Error in CategoryService.getAllCategories:', error);
      // Retourner des données de fallback en cas d'erreur
      return this.getFallbackCategories();
    }
  }

  async getCategoryById(id: string): Promise<Category | null> {
    try {
      const apiCategory = await categoryApiService.getCategoryById(parseInt(id));
      const subcategories = this.subcategoriesCache || await categoryApiService.getAllSubcategories();
      
      return CategoryMapper.mapApiToCategory(apiCategory, subcategories);
    } catch (error) {
      logger.error(`Error in CategoryService.getCategoryById for id ${id}:`, error);
      return null;
    }
  }

  async searchCategories(query: string): Promise<Category[]> {
    try {
      const apiCategories = await categoryApiService.searchCategories(query);
      const subcategories = this.subcategoriesCache || await categoryApiService.getAllSubcategories();
      
      return CategoryMapper.mapApiToCategories(apiCategories, subcategories);
    } catch (error) {
      logger.error(`Error in CategoryService.searchCategories for query "${query}":`, error);
      return [];
    }
  }

  getSubcategoriesByCategory(categoryId: string): string[] {
    if (!this.subcategoriesCache) {
      return [];
    }

    return this.subcategoriesCache
      .filter(sub => sub.categories.idCategorie === parseInt(categoryId) && !sub.deleted)
      .map(sub => sub.libelle);
  }

  getSubcategoriesWithIdsByCategory(categoryId: string): { id: number; name: string }[] {
    if (!this.subcategoriesCache) {
      return [];
    }

    return this.subcategoriesCache
      .filter(sub => sub.categories.idCategorie === parseInt(categoryId) && !sub.deleted)
      .map(sub => ({ id: sub.idSousCategorie, name: sub.libelle }));
  }

  clearCache(): void {
    this.categoriesCache = null;
    this.subcategoriesCache = null;
  }

  /**
   * Trouver l'ID d'une sous-catégorie par son nom (libellé) dans une catégorie donnée.
   * La comparaison ignore la casse et les accents.
   */
  async findSubcategoryIdByName(categoryId: string, subcategoryName: string): Promise<number | null> {
    const normalize = (s: string) => s
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .trim();

    try {
      // Assurer que le cache des sous-catégories est disponible
      if (!this.subcategoriesCache) {
        this.subcategoriesCache = await categoryApiService.getAllSubcategories();
      }

      const targetCategoryId = parseInt(categoryId);
      const target = normalize(subcategoryName);

      const match = this.subcategoriesCache.find(sub => {
        if (!sub || !sub.libelle || !sub.categories) return false;
        if (sub.categories.idCategorie !== targetCategoryId) return false;
        return normalize(sub.libelle) === target || normalize(sub.libelle).includes(target);
      });

      return match ? match.idSousCategorie : null;
    } catch (e) {
      console.error('Error in findSubcategoryIdByName:', e);
      return null;
    }
  }

  private getFallbackCategories(): Category[] {
    // Retourner les catégories par défaut en cas d'erreur API
    return [
      {
        id: "1",
        name: "Textile, habillement, cuirs et peaux",
        icon: "Shirt",
        subcategories: ["Couturiers", "Tailleurs", "Brodeurs", "Maroquiniers", "Cordonniers"],
      },
      {
        id: "2",
        name: "Bois et ameublement",
        icon: "Armchair",
        subcategories: ["Menuisiers", "Ébénistes", "Charpentiers", "Sculpteurs sur bois"],
      },
      {
        id: "3",
        name: "Métaux",
        icon: "Hammer",
        subcategories: ["Forgerons", "Soudeurs", "Ferblantiers", "Bijoutiers"],
      },
      {
        id: "4",
        name: "Bâtiment et construction",
        icon: "Building2",
        subcategories: ["Maçons", "Plombiers", "Électriciens", "Peintres"],
      },
      {
        id: "5",
        name: "Arts et décoration",
        icon: "Palette",
        subcategories: ["Calligraphes", "Céramistes", "Peintres décorateurs", "Sculpteurs"],
      },
      {
        id: "6",
        name: "Alimentation",
        icon: "UtensilsCrossed",
        subcategories: ["Boulangers", "Pâtissiers", "Bouchers", "Fromagers"],
      },
    ];
  }
}

export const categoryService = new CategoryService();


