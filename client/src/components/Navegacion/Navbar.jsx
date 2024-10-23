import { Bell, Home, Users, Menu, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useState } from 'react';

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-orange-400 to-orange-600 fixed w-full z-50 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16 lg:h-20">
          <h1 className="text-3xl lg:text-4xl font-bold text-white m-4 tracking-widest">
            Sportify
          </h1>

          <div className="hidden sm:flex items-center space-x-6">
            <Button className="text-white bg-transparent hover:bg-white hover:text-orange-500">
              <Home className="h-6 w-6" />  
              <span className="ml-2 hidden lg:inline">Home</span>
            </Button>
            <Button className="text-white bg-transparent hover:bg-white hover:text-orange-500">
              <Users className="h-6 w-6" />
              <span className="ml-2 hidden lg:inline">Comunidades</span>
            </Button>
            <Button size="icon" className="text-white bg-transparent hover:bg-white hover:text-orange-500">
              <Bell className="h-6 w-6" />
            </Button>
            <Avatar className="h-10 w-10 lg:h-12 lg:w-12 hover:shadow-lg">
              <AvatarImage src="/api/placeholder/32/32" />
              <AvatarFallback>US</AvatarFallback>
            </Avatar>
          </div>

          <Button
            size="icon"
            className="sm:hidden text-white hover:text-orange-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {isMenuOpen && (
          <div className="sm:hidden border-t border-orange-500">
            <div className="flex flex-col space-y-1 py-4">
              <Button className="flex items-center text-white hover:bg-orange-500">
                <Home className="mr-2 h-6 w-6" />
                Home
              </Button>
              <Button className="flex items-center text-white hover:bg-orange-500">
                <Users className="mr-2 h-6 w-6" />
                Comunidades
              </Button>
              <Button className="flex items-center text-white hover:bg-orange-500">
                <Bell className="mr-2 h-6 w-6" />
                Notificaciones
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
