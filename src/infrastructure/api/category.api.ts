import { apiClient } from './api.client';
import { API_CONFIG } from '../config/api.config';

export interface CategoryApiResponse {
  idCategorie: number;
  libelle: string;
  description: string | null;
  image: string | null;
  deleted: boolean;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface SubcategoryApiResponse {
  idSousCategorie: number;
  categories: CategoryApiResponse;
  libelle: string;
  description: string | null;
  image: string | null;
  deleted: boolean;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export class CategoryApiService {
  async getAllCategories(): Promise<CategoryApiResponse[]> {
    try {
      const response = await apiClient.get<CategoryApiResponse[]>(
        API_CONFIG.endpoints.categories.getAll
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  async getCategoryById(id: number): Promise<CategoryApiResponse> {
    try {
      const response = await apiClient.get<CategoryApiResponse>(
        API_CONFIG.endpoints.categories.getById(id)
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching category ${id}:`, error);
      throw error;
    }
  }

  async searchCategories(query: string): Promise<CategoryApiResponse[]> {
    try {
      const response = await apiClient.get<CategoryApiResponse[]>(
        API_CONFIG.endpoints.categories.search(query)
      );
      return response.data;
    } catch (error) {
      console.error(`Error searching categories with query "${query}":`, error);
      throw error;
    }
  }

  async getAllSubcategories(): Promise<SubcategoryApiResponse[]> {
    try {
      const response = await apiClient.get<SubcategoryApiResponse[]>(
        API_CONFIG.endpoints.subcategories.getAll
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      throw error;
    }
  }

  async getSubcategoriesByCategory(categoryId: number): Promise<SubcategoryApiResponse[]> {
    try {
      const response = await apiClient.get<SubcategoryApiResponse[]>(
        API_CONFIG.endpoints.subcategories.getByCategory(categoryId)
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching subcategories for category ${categoryId}:`, error);
      throw error;
    }
  }
}

export const categoryApiService = new CategoryApiService();
