import { Category } from '@/data/mockData';
import { CategoryApiResponse, SubcategoryApiResponse } from '../api/category.api';

export class CategoryMapper {
  static mapApiToCategory(apiCategory: CategoryApiResponse, subcategories: SubcategoryApiResponse[] = []): Category {
    return {
      id: apiCategory.idCategorie.toString(),
      name: apiCategory.libelle,
      icon: this.mapIconName(apiCategory.libelle),
      subcategories: subcategories
        .filter(sub => sub.categories.idCategorie === apiCategory.idCategorie && !sub.deleted)
        .map(sub => sub.libelle),
    };
  }

  static mapApiToCategories(apiCategories: CategoryApiResponse[], subcategories: SubcategoryApiResponse[] = []): Category[] {
    return apiCategories
      .filter(category => !category.deleted)
      .map(category => this.mapApiToCategory(category, subcategories));
  }

  private static mapIconName(categoryName: string): string {
    // Mapping des catégories de l'API vers les icônes utilisées dans l'interface
    const iconMap: Record<string, string> = {
      'agro-alimentaire': 'UtensilsCrossed',
      'textile': 'Shirt',
      'bois': 'Armchair',
      'métaux': 'Hammer',
      'batiment': 'Building2',
      'art': 'Palette',
      'alimentation': 'UtensilsCrossed',
      'hygiène': 'Sparkles',
      'audiovisuel': 'Video',
      'mines': 'Mountain',
    };

    // Recherche par correspondance partielle
    const lowerCategoryName = categoryName.toLowerCase();
    for (const [key, value] of Object.entries(iconMap)) {
      if (lowerCategoryName.includes(key)) {
        return value;
      }
    }

    // Icône par défaut
    return 'Palette';
  }
}
