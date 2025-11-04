import { ArtisanResponse } from '@/core/services/artisan.service';
import { Artisan } from '@/data/mockData';

export class ArtisanMapper {
  /**
   * Convertir un ArtisanResponse de l'API en Artisan pour le frontend
   */
  static mapApiToArtisan(apiArtisan: ArtisanResponse): Artisan {
    // Construction du nom complet
    const fullName = `${apiArtisan.prenom || ''} ${apiArtisan.nom || ''}`.trim();
    
    return {
      id: apiArtisan.idArtisan?.toString() || `artisan-${Date.now()}-${Math.random()}`,
      originalIdArtisan: apiArtisan.idArtisan, // Préserver l'ID original pour les liens
      name: fullName || 'Nom non disponible',
      profession: apiArtisan.profession || apiArtisan.sousCategories?.libelle || 'Profession non spécifiée',
      category: apiArtisan.sousCategories?.categories?.libelle || 'Catégorie inconnue',
      distance: 0, // À calculer avec géolocalisation ultérieurement
      rating: 4.5, // Valeur par défaut (pas dans l'API actuelle)
      reviewCount: 0, // Valeur par défaut (pas dans l'API actuelle)
      verified: true, // Tous les artisans dans la base sont vérifiés
      avatar: apiArtisan.sousCategories?.image || undefined,
      coverImage: apiArtisan.sousCategories?.image || undefined,
      description: apiArtisan.sousCategories?.description || 'Aucune description disponible',
      services: [], // À extraire si disponible
      phone: apiArtisan.telephone || '',
      whatsapp: apiArtisan.telephone || '', // Utiliser le même numéro pour WhatsApp
      address: apiArtisan.adresse || 'Localisation non disponible',
      latitude: 0, // À calculer avec géolocalisation
      longitude: 0, // À calculer avec géolocalisation
      gallery: [], // Pas disponible dans l'API actuelle
      schedule: {
      'Lundi': '08:00 - 18:00',
      'Mardi': '08:00 - 18:00',
      'Mercredi': '08:00 - 18:00',
      'Jeudi': '08:00 - 18:00',
      'Vendredi': '08:00 - 18:00',
        'Samedi': '08:00 - 13:00',
      'Dimanche': 'Fermé',
      },
      reviews: [], // À charger séparément si disponible
    };
  }

  /**
   * Convertir un tableau d'ArtisanResponse en tableau d'Artisan
   */
  static mapApiToArtisans(apiArtisans: ArtisanResponse[]): Artisan[] {
    return apiArtisans.map(api => this.mapApiToArtisan(api));
  }
}
