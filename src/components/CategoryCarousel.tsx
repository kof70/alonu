import { categories } from "@/data/mockData";
import { useNavigate } from "react-router-dom";
import * as Icons from "lucide-react";
import { LucideIcon } from "lucide-react";

const CategoryCarousel = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full overflow-x-auto pb-4">
      <div className="flex gap-4 min-w-max px-4">
        {categories.map((category) => {
          const IconComponent = (Icons[category.icon as keyof typeof Icons] as LucideIcon) || Icons.Box;
          
          return (
            <button
              key={category.id}
              onClick={() => navigate(`/category/${category.id}`)}
              className="flex flex-col items-center gap-2 group min-w-[80px]"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center group-hover:from-primary/20 group-hover:to-secondary/20 transition-all shadow-card group-hover:shadow-hover">
                <IconComponent className="w-7 h-7 text-primary" />
              </div>
              <span className="text-xs text-center font-medium text-foreground/80 group-hover:text-foreground transition-colors max-w-[80px] line-clamp-2">
                {category.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryCarousel;
