import { Category } from '../../types'

export interface ICategoryRepository {
  findAll(): Promise<Category[]>
  findById(id: string): Promise<Category | null>
  findFeatured(): Promise<Category[]>
}




