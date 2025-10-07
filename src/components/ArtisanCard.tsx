import { Artisan } from "@/data/mockData";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Star, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ArtisanCardProps {
  artisan: Artisan;
}

const ArtisanCard = ({ artisan }: ArtisanCardProps) => {
  const navigate = useNavigate();

  return (
    <Card className="overflow-hidden hover:shadow-hover transition-all duration-300 animate-fade-in gradient-card border-0">
      <div className="p-4">
        <div className="flex items-start gap-3 mb-3">
          <div className="relative">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg">
              {artisan.name.split(' ').map(n => n[0]).join('')}
            </div>
            {artisan.verified && (
              <CheckCircle2 className="absolute -bottom-1 -right-1 w-5 h-5 text-accent bg-background rounded-full" />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base mb-1 truncate">{artisan.name}</h3>
            <p className="text-sm text-muted-foreground mb-2">{artisan.profession}</p>
            
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1 text-accent font-medium">
                <MapPin className="w-3.5 h-3.5" />
                <span>{artisan.distance.toFixed(2)} km</span>
              </div>
              
              {artisan.reviewCount > 0 && (
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-primary text-primary" />
                  <span className="font-medium">{artisan.rating}</span>
                  <span className="text-muted-foreground">({artisan.reviewCount})</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <Button 
          onClick={() => navigate(`/artisan/${artisan.id}`)}
          className="w-full"
          size="sm"
        >
          Voir
        </Button>
      </div>
    </Card>
  );
};

export default ArtisanCard;
