import { useState } from 'react';
import { Bell, Home, Users, Menu, X, LogOut, User, Settings, Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from "@/lib/firebase/config.js";

export const Navbar = ({ onFollow }) => { // Recibe la función para manejar seguidores
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]); 
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      toast({
        variant: "destructive",
        title: "Error al cerrar sesión",
        description: "Hubo un problema al cerrar la sesión. Por favor, intenta de nuevo.",
      });
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      setSearchResults([]); 
      toast({
        title: "Error",
        description: "Ingresa un término para buscar.",
        variant: "destructive",
      });
      return;
    }

    try {
      const q = query(
        collection(db, 'Usuarios'), 
        where('nombre', '>=', searchQuery),
        where('nombre', '<=', searchQuery + '\uf8ff')
      );

      const querySnapshot = await getDocs(q);
      const results = [];
      querySnapshot.forEach((doc) => {
        results.push({ id: doc.id, ...doc.data() });
      });

      setSearchResults(results); 
      console.log("Resultados de búsqueda:", results); 
    } catch (error) {
      console.error("Error al buscar en Firestore:", error);
      toast({
        title: "Error",
        description: "No se pudo realizar la búsqueda. Intenta de nuevo.",
        variant: "destructive",
      });
    }
  };

  const handleFollow = (user) => {
    if (onFollow) {
      onFollow(user); // Llama a la función para actualizar seguidores en LayoutPrincipal
    }
  };

  return (
    <nav className="bg-gradient-to-r from-orange-400 to-orange-600 fixed w-full z-50 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <h1 className="text-3xl lg:text-4xl font-bold text-white tracking-widest">
            Sportify
          </h1>

          {/* Barra de búsqueda */}
          <form onSubmit={handleSearch} className="flex-1 flex justify-center mx-4 relative">
            <div className="relative w-1/2">
              <input
                type="text"
                className="w-full px-4 py-2 text-sm rounded-full shadow focus:outline-none focus:ring-2 focus:ring-orange-300"
                placeholder="Buscar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 focus:outline-none"
                style={{ backgroundColor: "transparent", border: "none" }}
              >
                <Search className="w-5 h-5 text-orange-500 hover:text-orange-700" />
              </button>
            </div>

            {searchResults.length > 0 && (
              <div className="absolute top-full mt-2 w-1/2 bg-white shadow-lg rounded-lg z-10 max-h-60 overflow-y-auto">
                <ul>
                  {searchResults.map((result) => (
                    <li
                      key={result.id}
                      className="flex justify-between items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      <div>
                        <p className="font-medium">{result.nombre}</p>
                        <p className="text-sm text-gray-500">{result.email}</p>
                      </div>
                      <button
                        onClick={() => handleFollow(result)} // Actualiza la lista de seguidores
                        className="px-3 py-1 text-sm font-medium text-white bg-orange-500 rounded-full hover:bg-orange-600 focus:outline-none"
                      >
                        Seguir
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </form>

          {/* Botones de navegación */}
          <div className="hidden sm:flex items-center space-x-6">
            <Button
              className="text-white bg-transparent hover:bg-white hover:text-orange-500 transition-colors duration-200"
              onClick={() => navigate('/home')}
            >
              <Home className="h-6 w-6" />
              <span className="ml-2 hidden lg:inline">Home</span>
            </Button>
            <Button
              className="text-white bg-transparent hover:bg-white hover:text-orange-500 transition-colors duration-200"
              onClick={() => navigate('/comunidades')}
            >
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
        </div>
      </div>
    </nav>
  );
};
