import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Trouvez l'artisan dont vous avez besoin"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-12 h-14 rounded-full border-2 text-base shadow-card focus-visible:shadow-hover transition-all"
      />
    </div>
  );
};

export default SearchBar;
