import { apiClient } from '@/infrastructure/api/api.client';

export interface ArtisanResponse {
  idArtisan: number;
  sousCategories: {
    idSousCategorie: number;
    categories: {
      idCategorie: number;
      libelle: string;
      description?: string;
      image?: string;
      deleted: boolean;
    };
    libelle: string;
    description?: string;
    image?: string;
    deleted: boolean;
  };
  nom: string;
  prenom: string;
  sexe: string;
  dateNaissance: string;
  lieuNaissance: string;
  adresse: string;
  telephone: string;
  email?: string;
  profession: string;
  niveauEtude: string;
  anneeExperience: number;
  situationMatrimoniale: string;
  nombreEnfantCharge: number;
  nomPrenomPersonneContact: string;
  telephonePersonneContact: string;
}

export class ArtisanService {
  private artisansCache: ArtisanResponse[] | null = null;
  private cacheTimestamp: number = 0;
  private CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  /**
   * Récupérer tous les artisans avec mise en cache
   */
  async getAllArtisans(): Promise<ArtisanResponse[]> {
    try {
      const now = Date.now();
      
      // Vérifier le cache
      if (this.artisansCache && (now - this.cacheTimestamp) < this.CACHE_DURATION) {
        console.log('🚀 Cache artisans utilisé');
        return this.artisansCache;
      }

      console.log('⚡ Chargement de tous les artisans depuis l\'API...');
      const response = await apiClient.get<ArtisanResponse[]>('/artisans');
      
      const artisans = Array.isArray(response.data) ? response.data : [];
      
      // Mettre en cache
      this.artisansCache = artisans;
      this.cacheTimestamp = now;
      
      console.log(`✅ ${artisans.length} artisans chargés et mis en cache`);
      return artisans;
    } catch (error) {
      console.error('❌ Erreur lors du chargement des artisans:', error);
      return [];
    }
  }

  /**
   * Récupérer les artisans d'une catégorie spécifique
   */
  async getArtisansByCategory(categoryId: number): Promise<ArtisanResponse[]> {
    try {
      console.log(`📂 Filtrage artisans pour catégorie ${categoryId}`);
      const allArtisans = await this.getAllArtisans();
      
      const filtered = allArtisans.filter(artisan => 
        artisan.sousCategories?.categories?.idCategorie === categoryId
      );
      
      console.log(`✅ ${filtered.length} artisans trouvés pour catégorie ${categoryId}`);
      return filtered;
    } catch (error) {
      console.error(`❌ Erreur filtrage catégorie ${categoryId}:`, error);
      return [];
    }
  }

  /**
   * Récupérer les artisans d'une sous-catégorie spécifique
   */
  async getArtisansBySubcategory(subcategoryId: number): Promise<ArtisanResponse[]> {
    try {
      console.log(`📍 Filtrage artisans pour sous-catégorie ${subcategoryId}`);
      const allArtisans = await this.getAllArtisans();
      
      const filtered = allArtisans.filter(artisan => 
        artisan.sousCategories?.idSousCategorie === subcategoryId
      );
      
      console.log(`✅ ${filtered.length} artisans trouvés pour sous-catégorie ${subcategoryId}`);
      return filtered;
    } catch (error) {
      console.error(`❌ Erreur filtrage sous-catégorie ${subcategoryId}:`, error);
      return [];
    }
  }

  /**
   * Rechercher des artisans par nom, profession ou localisation
   */
  async searchArtisans(query: string): Promise<ArtisanResponse[]> {
    try {
      if (!query || query.trim().length < 2) {
        return [];
      }

      console.log(`🔍 Recherche artisans: "${query}"`);
      const allArtisans = await this.getAllArtisans();
      
      const normalizeText = (text: string) => {
        if (!text) return '';
        return text
          .toLowerCase()
          .normalize('NFD')
          .replace(/\p{Diacritic}/gu, '')
          .trim();
      };

      const searchTerm = normalizeText(query);
      
      const results = allArtisans.filter(artisan => {
        const nom = normalizeText(artisan.nom || '');
        const prenom = normalizeText(artisan.prenom || '');
        const profession = normalizeText(artisan.profession || '');
        const adresse = normalizeText(artisan.adresse || '');
        const sousCategorie = normalizeText(artisan.sousCategories?.libelle || '');
        const categorie = normalizeText(artisan.sousCategories?.categories?.libelle || '');

        return nom.includes(searchTerm) ||
               prenom.includes(searchTerm) ||
               profession.includes(searchTerm) ||
               adresse.includes(searchTerm) ||
               sousCategorie.includes(searchTerm) ||
               categorie.includes(searchTerm);
      });
      
      console.log(`✅ ${results.length} artisans trouvés pour "${query}"`);
      return results;
    } catch (error) {
      console.error('❌ Erreur recherche artisans:', error);
      return [];
    }
  }

  /**
   * Récupérer un artisan par son ID
   */
  async getArtisanById(id: number): Promise<ArtisanResponse | null> {
    try {
      const allArtisans = await this.getAllArtisans();
      return allArtisans.find(a => a.idArtisan === id) || null;
    } catch (error) {
      console.error(`❌ Erreur récupération artisan ${id}:`, error);
      return null;
    }
  }

  /**
   * Vider le cache
   */
  clearCache(): void {
    this.artisansCache = null;
    this.cacheTimestamp = 0;
    console.log('🗑️ Cache artisans vidé');
  }
}

export const artisanService = new ArtisanService();
