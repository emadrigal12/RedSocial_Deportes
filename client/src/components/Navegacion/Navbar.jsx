import { Bell, Home, Search, MessageCircle, Users } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm fixed w-full z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-blue-600">Red Social</h1>
            <div className="hidden md:block ml-10">
              <div className="flex items-center space-x-4">
                <Button  className="flex items-center">
                  <Home className="mr-2 h-4 w-4" />
                  Inicio
                </Button>
                <Button  className="flex items-center">
                  <Users className="mr-2 h-4 w-4" />
                  Amigos
                </Button>
                <Button  className="flex items-center">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Mensajes
                </Button>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button size="icon">
              <Search className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};