import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import CategoryCarousel from "@/components/CategoryCarousel";
import ArtisanCard from "@/components/ArtisanCard";
import { artisans } from "@/data/mockData";
import heroImage from "@/assets/hero-artisans.jpg";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[300px] md:h-[400px] overflow-hidden">
        <img 
          src={heroImage} 
          alt="Artisans au travail" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 animate-fade-in">
            Trouvez l'artisan proche de vous
          </h2>
          <div className="w-full max-w-2xl animate-scale-in">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 border-b">
        <div className="container px-0">
          <h3 className="text-xl font-semibold mb-4 px-4">Catégories</h3>
          <CategoryCarousel />
        </div>
      </section>

      {/* Artisans Grid */}
      <section className="py-8">
        <div className="container px-4">
          <h3 className="text-xl font-semibold mb-6">Artisans près de vous</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {artisans.map((artisan) => (
              <ArtisanCard key={artisan.id} artisan={artisan} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Index;
