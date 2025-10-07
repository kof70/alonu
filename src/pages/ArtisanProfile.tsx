import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import { artisans } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Phone, MessageCircle, MapPin, Star, CheckCircle2, Clock } from "lucide-react";

const ArtisanProfile = () => {
  const { artisanId } = useParams();
  const artisan = artisans.find(a => a.id === artisanId);
  
  if (!artisan) {
    return <div>Artisan introuvable</div>;
  }

  const handleWhatsApp = () => {
    window.open(`https://wa.me/${artisan.whatsapp.replace(/\s/g, '')}`, '_blank');
  };

  const handleCall = () => {
    window.location.href = `tel:${artisan.phone}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Cover Image */}
      <div className="h-48 md:h-64 bg-gradient-to-br from-primary to-secondary" />

      <div className="container px-4 pb-8">
        {/* Profile Header */}
        <div className="relative -mt-16 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
            <div className="relative">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-primary to-secondary border-4 border-background flex items-center justify-center text-white font-bold text-3xl shadow-lg">
                {artisan.name.split(' ').map(n => n[0]).join('')}
              </div>
              {artisan.verified && (
                <CheckCircle2 className="absolute -bottom-2 -right-2 w-8 h-8 text-accent bg-background rounded-full p-1" />
              )}
            </div>
            
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{artisan.name}</h1>
              <p className="text-lg text-muted-foreground mb-3">{artisan.profession}</p>
              
              <div className="flex flex-wrap gap-3 items-center">
                <div className="flex items-center gap-1 text-accent font-medium">
                  <MapPin className="w-4 h-4" />
                  <span>{artisan.distance.toFixed(2)} km</span>
                </div>
                
                {artisan.reviewCount > 0 && (
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-primary text-primary" />
                    <span className="font-semibold">{artisan.rating}</span>
                    <span className="text-muted-foreground">({artisan.reviewCount} avis)</span>
                  </div>
                )}
                
                {artisan.verified && (
                  <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
                    Vérifié CRM
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Contact Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Button onClick={handleWhatsApp} className="gap-2 bg-[#25D366] hover:bg-[#25D366]/90">
            <MessageCircle className="w-4 h-4" />
            WhatsApp
          </Button>
          <Button onClick={handleCall} variant="outline" className="gap-2">
            <Phone className="w-4 h-4" />
            Appeler
          </Button>
        </div>

        {/* Description */}
        <Card className="p-6 mb-6">
          <h2 className="text-lg font-semibold mb-3">À propos</h2>
          <p className="text-muted-foreground leading-relaxed">{artisan.description}</p>
        </Card>

        {/* Services */}
        <Card className="p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {artisan.services.map((service, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span>{service}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Schedule */}
        <Card className="p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Horaires d'ouverture
          </h2>
          <div className="space-y-2">
            {Object.entries(artisan.schedule).map(([day, hours]) => (
              <div key={day} className="flex justify-between items-center py-2 border-b last:border-0">
                <span className="font-medium">{day}</span>
                <span className="text-muted-foreground">{hours}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Location */}
        <Card className="p-6 mb-6">
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Localisation
          </h2>
          <p className="text-muted-foreground mb-4">{artisan.address}</p>
          <Button variant="outline" className="w-full">
            Voir sur la carte
          </Button>
        </Card>

        {/* Reviews */}
        {artisan.reviews.length > 0 && (
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Avis clients</h2>
            <div className="space-y-4">
              {artisan.reviews.map((review) => (
                <div key={review.id} className="pb-4 border-b last:border-0">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{review.author}</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-primary text-primary" />
                      <span className="font-semibold">{review.rating}</span>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm mb-1">{review.comment}</p>
                  <span className="text-xs text-muted-foreground">{new Date(review.date).toLocaleDateString('fr-FR')}</span>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ArtisanProfile;
