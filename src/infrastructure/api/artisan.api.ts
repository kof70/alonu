import { apiClient } from './api.client';
import { API_CONFIG } from '../config/api.config';

export interface ArtisanApiResponse {
  idArtisan: number;
  sousCategories: {
    idSousCategorie: number;
    categories: {
      idCategorie: number;
      libelle: string;
      description: string | null;
      image: string | null;
      deleted: boolean;
      version: number;
      createdAt: string;
      updatedAt: string;
    };
    libelle: string;
    description: string | null;
    image: string | null;
    deleted: boolean;
    version: number;
    createdAt: string;
    updatedAt: string;
  };
  users: {
    idUser: number;
    username: string;
    email: string;
    password: string;
    nom: string;
    prenom: string;
    avatar: string;
    deleted: boolean;
    role: number;
    version: number;
    createdAt: string;
    updatedAt: string;
  };
  crms: {
    idCrm: number;
    libelle: string;
    telephone: string;
    adresse: string;
    email: string;
    deleted: boolean;
    version: number;
    createdAt: string;
    updatedAt: string;
  };
  telephone: string;
  numeroEnr: string;
  adresse: string | null;
  longitude: number | null;
  latitude: number | null;
  facebook: string | null;
  whatsapp: string | null;
  tweeter: string | null;
  actif: boolean;
  deleted: boolean;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface ArtisanSearchParams {
  page?: number;
  limit?: number;
  categoryId?: number;
  subcategoryId?: number;
  search?: string;
  verified?: boolean;
  active?: boolean;
}

export class ArtisanApiService {
  async getAllArtisans(params?: ArtisanSearchParams): Promise<ArtisanApiResponse[]> {
    try {
      // Utiliser l'endpoint des artisans non supprimés
      const response = await apiClient.get<ArtisanApiResponse[]>(
        API_CONFIG.endpoints.artisans.getAll
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching artisans:', error);
      throw error;
    }
  }

  async getArtisanById(id: number): Promise<ArtisanApiResponse> {
    try {
      const response = await apiClient.get<ArtisanApiResponse>(
        API_CONFIG.endpoints.artisans.getById(id)
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching artisan ${id}:`, error);
      throw error;
    }
  }

  async searchArtisans(query: string): Promise<ArtisanApiResponse[]> {
    try {
      const response = await apiClient.get<ArtisanApiResponse[]>(
        API_CONFIG.endpoints.artisans.search(query)
      );
      return response.data;
    } catch (error) {
      console.error(`Error searching artisans with query "${query}":`, error);
      throw error;
    }
  }

  async getArtisansByCategory(categoryId: number): Promise<ArtisanApiResponse[]> {
    try {
      // Filtrer les artisans par catégorie côté client
      const allArtisans = await this.getAllArtisans();
      return allArtisans.filter(artisan => 
        artisan.sousCategories.categories.idCategorie === categoryId
      );
    } catch (error) {
      console.error(`Error fetching artisans for category ${categoryId}:`, error);
      throw error;
    }
  }

  async getArtisansBySubcategory(subcategoryId: number): Promise<ArtisanApiResponse[]> {
    try {
      // Filtrer les artisans par sous-catégorie côté client
      const allArtisans = await this.getAllArtisans();
      return allArtisans.filter(artisan => 
        artisan.sousCategories.idSousCategorie === subcategoryId
      );
    } catch (error) {
      console.error(`Error fetching artisans for subcategory ${subcategoryId}:`, error);
      throw error;
    }
  }

  async getArtisansPaginated(page: number): Promise<{ data: ArtisanApiResponse[], total: number, current_page: number, last_page: number }> {
    try {
      const response = await apiClient.get<{ data: ArtisanApiResponse[], total: number, current_page: number, last_page: number }>(
        API_CONFIG.endpoints.artisans.getPages(page)
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching artisans page ${page}:`, error);
      throw error;
    }
  }

  async searchArtisansPaginated(page: number, query: string): Promise<{ data: ArtisanApiResponse[], total: number, current_page: number, last_page: number }> {
    try {
      const response = await apiClient.get<{ data: ArtisanApiResponse[], total: number, current_page: number, last_page: number }>(
        API_CONFIG.endpoints.artisans.searchPages(page, query)
      );
      return response.data;
    } catch (error) {
      console.error(`Error searching artisans page ${page} with query "${query}":`, error);
      throw error;
    }
  }

  async getPremiumArtisans(): Promise<ArtisanApiResponse[]> {
    try {
      const response = await apiClient.get<ArtisanApiResponse[]>(
        API_CONFIG.endpoints.artisans.getPremium
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching premium artisans:', error);
      throw error;
    }
  }

  async getRandomArtisans(count: number): Promise<ArtisanApiResponse[]> {
    try {
      // ULTRA-RAPIDE : récupérer seulement 1 page (10 artisans)
      // C'est largement suffisant pour avoir de la variété
      const response = await this.getArtisansPaginated(1);
      const allArtisans = response.data;
      
      // Mélange ultra-rapide
      const shuffled = allArtisans.sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count);
    } catch (error) {
      console.error('Error fetching random artisans:', error);
      throw error;
    }
  }
}

export const artisanApiService = new ArtisanApiService();
