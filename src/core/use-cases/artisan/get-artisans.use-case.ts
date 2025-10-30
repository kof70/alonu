import { IArtisanRepository } from '../../domain/interfaces/repositories'
import { Artisan, ArtisanFilters } from '../../domain/types'

export class GetArtisansUseCase {
  constructor(private artisanRepository: IArtisanRepository) {}

  async execute(filters?: ArtisanFilters): Promise<Artisan[]> {
    return this.artisanRepository.findAll(filters)
  }
}




