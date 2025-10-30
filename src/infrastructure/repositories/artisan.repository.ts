import { IArtisanRepository } from '../../core/domain/interfaces/repositories'
import { Artisan, ArtisanFilters } from '../../core/domain/types'

export class ArtisanRepository implements IArtisanRepository {
  private mockArtisans: Artisan[] = [
    {
      id: '1',
      name: 'Koffi Koudodji',
      profession: 'Mécanicien automobile',
      description: 'Spécialisé dans la réparation de moteurs et systèmes électriques',
      avatar: '/assets/images/profile.png',
      rating: 4.8,
      isPopular: true,
      categories: ['Métaux et constructions'],
      location: 'Lomé, Togo'
    },
    {
      id: '2',
      name: 'Awa Traoré',
      profession: 'Coiffeuse',
      description: 'Spécialisée en coiffure moderne et traditionnelle',
      avatar: '/assets/images/profile.png',
      rating: 4.9,
      categories: ['Hygiène et soins corporels'],
      location: 'Lomé, Togo'
    },
    {
      id: '3',
      name: 'Djibril Diallo',
      profession: 'Électricien',
      description: 'Installation et dépannage électrique',
      avatar: '/assets/images/profile.png',
      rating: 4.7,
      categories: ['Métaux et constructions'],
      location: 'Lomé, Togo'
    }
  ]

  async findAll(filters?: ArtisanFilters): Promise<Artisan[]> {
    let artisans = [...this.mockArtisans]

    if (filters?.category) {
      artisans = artisans.filter(a => a.categories.includes(filters.category!))
    }

    if (filters?.search) {
      const searchLower = filters.search.toLowerCase()
      artisans = artisans.filter(
        a => 
          a.name.toLowerCase().includes(searchLower) ||
          a.profession.toLowerCase().includes(searchLower)
      )
    }

    return artisans
  }

  async findById(id: string): Promise<Artisan | null> {
    return this.mockArtisans.find(a => a.id === id) || null
  }

  async findByCategory(categoryId: string): Promise<Artisan[]> {
    return this.mockArtisans.filter(a => a.categories.includes(categoryId))
  }

  async search(query: string): Promise<Artisan[]> {
    const queryLower = query.toLowerCase()
    return this.mockArtisans.filter(
      a => 
        a.name.toLowerCase().includes(queryLower) ||
        a.profession.toLowerCase().includes(queryLower) ||
        a.description.toLowerCase().includes(queryLower)
    )
  }
}




