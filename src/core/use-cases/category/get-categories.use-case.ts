import { ICategoryRepository } from '../../domain/interfaces/repositories'
import { Category } from '../../domain/types'

export class GetCategoriesUseCase {
  constructor(private categoryRepository: ICategoryRepository) {}

  async execute(): Promise<Category[]> {
    return this.categoryRepository.findAll()
  }
}

export class GetFeaturedCategoriesUseCase {
  constructor(private categoryRepository: ICategoryRepository) {}

  async execute(): Promise<Category[]> {
    return this.categoryRepository.findFeatured()
  }
}




