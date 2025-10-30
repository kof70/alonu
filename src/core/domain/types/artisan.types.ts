export interface Artisan {
  id: string
  name: string
  profession: string
  description: string
  avatar?: string
  rating: number
  isPopular?: boolean
  categories: string[]
  location?: string
  contact?: {
    phone?: string
    email?: string
  }
}

export interface ArtisanFilters {
  category?: string
  rating?: number
  location?: string
  search?: string
}







