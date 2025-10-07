import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { categories } from "@/data/mockData";
import { Search, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const CategoryPage = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  
  const category = categories.find(c => c.id === categoryId);
  
  if (!category) {
    return <div>Catégorie introuvable</div>;
  }

  const filteredSubcategories = category.subcategories.filter(sub =>
    sub.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">{category.name}</h1>
        
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Rechercher une sous catégorie"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="space-y-2">
          {filteredSubcategories.map((subcategory, index) => (
            <button
              key={index}
              onClick={() => navigate(`/search?category=${category.name}&subcategory=${subcategory}`)}
              className="w-full flex items-center justify-between p-4 bg-card rounded-lg border hover:shadow-card transition-all group"
            >
              <span className="font-medium">{subcategory}</span>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
