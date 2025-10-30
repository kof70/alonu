import { IArtisanRepository } from '../../domain/interfaces/repositories'
import { Artisan } from '../../domain/types'

export class GetArtisanByIdUseCase {
  constructor(private artisanRepository: IArtisanRepository) {}

  async execute(id: string): Promise<Artisan | null> {
    return this.artisanRepository.findById(id)
  }
}




