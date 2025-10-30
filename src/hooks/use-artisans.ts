import { useState, useEffect, useCallback } from 'react';
import { Artisan } from '@/data/mockData';
import { artisanService } from '@/core/services/artisan.service';
import { ArtisanMapper } from '@/infrastructure/mappers/artisan.mapper';

export const useArtisans = () => {
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArtisans = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const apiData = await artisanService.getAllArtisans();
      const mappedData = ArtisanMapper.mapApiToArtisans(apiData);
      setArtisans(mappedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des artisans');
      console.error('Error fetching artisans:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArtisans();
  }, [fetchArtisans]);

  const refetch = useCallback(async () => {
    artisanService.clearCache();
    await fetchArtisans();
  }, [fetchArtisans]);

  return {
    artisans,
    loading,
    error,
    refetch,
  };
};

export const useArtisan = (id: string) => {
  const [artisan, setArtisan] = useState<Artisan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArtisan = async () => {
      try {
        setLoading(true);
        setError(null);
        const apiData = await artisanService.getArtisanById(parseInt(id));
        if (apiData) {
          const mappedData = ArtisanMapper.mapApiToArtisan(apiData);
          setArtisan(mappedData);
        } else {
          setArtisan(null);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement de l\'artisan');
        console.error('Error fetching artisan:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchArtisan();
    }
  }, [id]);

  return {
    artisan,
    loading,
    error,
  };
};

export const useFeaturedArtisans = (limit: number = 8) => {
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedArtisans = async () => {
      try {
        setLoading(true);
        setError(null);
        // Récupérer tous les artisans et prendre les premiers
        const apiData = await artisanService.getAllArtisans();
        const mappedData = ArtisanMapper.mapApiToArtisans(apiData);
        // Prendre les N premiers comme "featured"
        setArtisans(mappedData.slice(0, limit));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement des artisans vedettes');
        console.error('Error fetching featured artisans:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedArtisans();
  }, [limit]);

  const refetch = useCallback(async () => {
    artisanService.clearCache();
    try {
      setLoading(true);
      setError(null);
      const apiData = await artisanService.getAllArtisans();
      const mappedData = ArtisanMapper.mapApiToArtisans(apiData);
      setArtisans(mappedData.slice(0, limit));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des artisans vedettes');
      console.error('Error fetching featured artisans:', err);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  return {
    artisans,
    loading,
    error,
    refetch,
  };
};

export const useArtisanSearch = () => {
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (query: string) => {
    if (!query.trim()) {
      setArtisans([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log('🔍 Recherche hook:', query);
      const apiData = await artisanService.searchArtisans(query);
      console.log(`✅ ${apiData.length} résultats API trouvés`);
      // Mapper les résultats API vers le format Artisan
      const mappedData = ArtisanMapper.mapApiToArtisans(apiData);
      console.log(`✅ ${mappedData.length} résultats mappés`);
      setArtisans(mappedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la recherche');
      console.error('❌ Error searching artisans:', err);
      setArtisans([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearSearch = useCallback(() => {
    setArtisans([]);
    setError(null);
  }, []);

  return {
    artisans,
    loading,
    error,
    search,
    clearSearch,
  };
};


