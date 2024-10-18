import { Bell, Home, Search, MessageCircle, Users, Menu, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useState } from 'react';

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

   return (
    <nav className="bg-white shadow-sm fixed w-full z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16 lg:h-20 items-center">
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl lg:text-3xl font-bold text-blue-600 mr-5">Sportify</h1>
            <div className="hidden md:flex items-center space-x-2">
              <Button 
                className="flex items-center space-x-2 px-4 hover:bg-blue-50 hover:text-blue-600"
              >
                <Home className="h-5 w-5" />
                <span className="hidden lg:inline">Inicio</span>
              </Button>
              <Button 
                className="flex items-center space-x-2 px-4 hover:bg-blue-50 hover:text-blue-600"
              >
                <Users className="h-5 w-5" />
                <span className="hidden lg:inline">Amigos</span>
              </Button>
              <Button 
                className="flex items-center space-x-2 px-4 hover:bg-blue-50 hover:text-blue-600"
              >
                <MessageCircle className="h-5 w-5" />
                <span className="hidden lg:inline">Mensajes</span>
              </Button>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2">
              <Button 
                size="icon" 
                className="h-10 w-10 hover:bg-blue-50 hover:text-blue-600"
              >
                <Bell className="h-5 w-5" />
              </Button>
              <Button 
                size="icon" 
                className="h-10 w-10 hover:bg-blue-50 hover:text-blue-600"
              >
                <Search className="h-5 w-5" />
              </Button>
            </div>
            <Avatar className="h-10 w-10 lg:h-12 lg:w-12">
              <AvatarImage src="/api/placeholder/32/32" />
              <AvatarFallback>US</AvatarFallback>
            </Avatar>
            <Button
              size="icon"
              className="md:hidden h-10 w-10"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden border-t">
            <div className="px-4 pt-2 pb-3 space-y-1">
              <Button 
                className="w-full justify-start hover:bg-blue-50 hover:text-blue-600"
              >
                <Home className="mr-2 h-5 w-5" />
                Inicio
              </Button>
              <Button 
                className="w-full justify-start hover:bg-blue-50 hover:text-blue-600"
              >
                <Users className="mr-2 h-5 w-5" />
                Amigos
              </Button>
              <Button 
                className="w-full justify-start hover:bg-blue-50 hover:text-blue-600"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Mensajes
              </Button>
              <Button 
                className="w-full justify-start hover:bg-blue-50 hover:text-blue-600"
              >
                <Bell className="mr-2 h-5 w-5" />
                Notificaciones
              </Button>
              <Button 
                className="w-full justify-start hover:bg-blue-50 hover:text-blue-600"
              >
                <Search className="mr-2 h-5 w-5" />
                Buscar
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};