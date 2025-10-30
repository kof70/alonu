import { ICategoryRepository } from '../../core/domain/interfaces/repositories'
import { Category } from '../../core/domain/types'
import { Palette, Sparkles, Video, Shirt, TreePine, Building2, Mountain } from 'lucide-react'

export class CategoryRepository implements ICategoryRepository {
  private mockCategories: Category[] = [
    {
      id: '1',
      name: "Artisanat d'art et décoration",
      icon: 'palette',
      count: 21,
      color: 'bg-primary',
      image: '/assets/images/metier-bouche.jpg'
    },
    {
      id: '2',
      name: 'Hygiène et soins corporels',
      icon: 'sparkles'
    },
    {
      id: '3',
      name: 'Audiovisuel et communication',
      icon: 'video'
    },
    {
      id: '4',
      name: 'Textile, habillement,...',
      icon: 'shirt'
    },
    {
      id: '5',
      name: 'Bois et Assimilés, Mobilier et...',
      icon: 'tree-pine'
    },
    {
      id: '6',
      name: 'Métaux, et constructions...',
      icon: 'building2'
    },
    {
      id: '7',
      name: 'Mines et Carrières,...',
      icon: 'mountain'
    }
  ]

  async findAll(): Promise<Category[]> {
    return [...this.mockCategories]
  }

  async findById(id: string): Promise<Category | null> {
    return this.mockCategories.find(c => c.id === id) || null
  }

  async findFeatured(): Promise<Category[]> {
    return this.mockCategories.filter(c => c.isFeatured)
  }
}




