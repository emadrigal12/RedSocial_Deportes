import { useState } from 'react';
import { Bell, Home, Users, Menu, X, LogOut, User, Settings } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from '../../context/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <nav className="bg-gradient-to-r from-orange-400 to-orange-600 fixed w-full z-50 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16 lg:h-20">
          <h1 className="text-3xl lg:text-4xl font-bold text-white m-4 tracking-widest">
            Sportify
          </h1>

          <div className="hidden sm:flex items-center space-x-6">
            <Button className="text-white bg-transparent hover:bg-white hover:text-orange-500 transition-colors duration-200">
              <Home className="h-6 w-6" />
              <span className="ml-2 hidden lg:inline">Home</span>
            </Button>
            <Button className="text-white bg-transparent hover:bg-white hover:text-orange-500 transition-colors duration-200">
              <Users className="h-6 w-6" />
              <span className="ml-2 hidden lg:inline">Comunidades</span>
            </Button>
            <Button 
              size="icon" 
              className="text-white bg-transparent hover:bg-white hover:text-orange-500 transition-colors duration-200"
            >
              <Bell className="h-6 w-6" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-10 w-10 lg:h-12 lg:w-12 hover:shadow-lg cursor-pointer ring-2 ring-white/50 hover:ring-white transition-all duration-200">
                  <AvatarImage src={user?.photoURL || "/api/placeholder/32/32"} />
                  <AvatarFallback className="bg-orange-200 text-orange-700">
                    {user?.displayName?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 mt-2" align="end">
                <DropdownMenuLabel className="flex items-center space-x-2">
                  <span>Mi Cuenta</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer hover:bg-orange-50 focus:bg-orange-50">
                  <User className="mr-2 h-4 w-4" />
                  <span>Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer hover:bg-orange-50 focus:bg-orange-50">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Configuración</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="cursor-pointer text-red-600 hover:bg-red-50 focus:bg-red-50"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar Sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
              <Button className="flex items-center text-white hover:bg-orange-500 justify-start">
                <Home className="mr-2 h-6 w-6" />
                Home
              </Button>
              <Button className="flex items-center text-white hover:bg-orange-500 justify-start">
                <Users className="mr-2 h-6 w-6" />
                Comunidades
              </Button>
              <Button className="flex items-center text-white hover:bg-orange-500 justify-start">
                <Bell className="mr-2 h-6 w-6" />
                Notificaciones
              </Button>
              <Button className="flex items-center text-white hover:bg-orange-500 justify-start">
                <User className="mr-2 h-6 w-6" />
                Perfil
              </Button>
              <Button 
                className="flex items-center text-white hover:bg-red-500 justify-start"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-6 w-6" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};