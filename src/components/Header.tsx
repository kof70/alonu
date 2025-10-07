import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <h1 
          className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent cursor-pointer"
          onClick={() => navigate("/")}
        >
          ALONU
        </h1>
        
        <Button variant="ghost" size="icon">
          <Menu className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};

export default Header;
