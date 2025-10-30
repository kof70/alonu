import { useState, useEffect } from 'react';
import { Category } from '@/data/mockData';
import { categoryService } from '@/core/services/category.service';

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await categoryService.getAllCategories();
        setCategories(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement des catégories');
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const refetch = async () => {
    categoryService.clearCache();
    await fetchCategories();
  };

  return {
    categories,
    loading,
    error,
    refetch,
  };
};

export const useCategory = (id: string) => {
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await categoryService.getCategoryById(id);
        setCategory(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement de la catégorie');
        console.error('Error fetching category:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCategory();
    }
  }, [id]);

  return {
    category,
    loading,
    error,
  };
};


