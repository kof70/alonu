import { Artisan, ArtisanFilters } from '../../types'

export interface IArtisanRepository {
  findAll(filters?: ArtisanFilters): Promise<Artisan[]>
  findById(id: string): Promise<Artisan | null>
  findByCategory(categoryId: string): Promise<Artisan[]>
  search(query: string): Promise<Artisan[]>
}




