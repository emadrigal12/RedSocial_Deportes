import { useState, useEffect } from 'react';
import { Bell, Home, Users, Menu, X, LogOut, User, Settings, Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { FollowProvider } from '@/context/FollowContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import EditarPerfil from '../Perfil/EditarPerfil';
import { useFollow } from '../../context/FollowContext';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { db } from "../../lib/firebase/config.js";
import { NotificacionesLista } from '../Notificacion/NotificacionLista';
import { NotificacionesPanel } from '../Notificacion/NotificacionPanel.jsx';
import { subscribeToUserNotifications, markAllNotificationsAsRead, createNotification } from '../../config/Notificaciones/Notificaciones.js';
import { DesactivarCuenta } from '../../components/Perfil/DesactivarCuenta.jsx';

export const Navbar = ({ onFollow }) => { 
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]); 
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { deactivateAccount, user, logout } = useAuth();
  const [isAccountDeactivated, setIsAccountDeactivated] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { followUser, following } = useFollow();

  useEffect(() => {
    if (user?.uid) {
      const unsubscribe = subscribeToUserNotifications(user.uid, (newNotifications) => {
        setNotifications(newNotifications);
        setUnreadCount(newNotifications.filter(n => !n.read).length);
      });
      return () => unsubscribe();
    }
  }, [user?.uid]);

  const handleMarkAllRead = async () => {
    if (user?.uid) {
      await markAllNotificationsAsRead(user.uid);
    }
  };

  const handleMenu = (e) => {
    e.preventDefault();
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleDeactivateAccount = async () => {
    try {
      await deactivateAccount();
      setIsAccountDeactivated(true);
      setIsDropdownOpen(false);
      toast({
        variant: 'success',
        title: 'Cuenta desactivada',
        description: 'Tu cuenta ha sido desactivada exitosamente.',
      });
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Error al desactivar la cuenta:', error);
      setIsDropdownOpen(false);
      toast({
        variant: 'destructive',
        title: 'Error al desactivar la cuenta',
        description: 'Hubo un problema al desactivar tu cuenta. Por favor, intenta de nuevo.',
      });
    }
  };

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

  const handleFollow = async (userToFollow) => {
    if (!userToFollow.id) {
      toast({
        title: 'Error',
        description: 'No se puede enviar la solicitud. Usuario inválido.',
        variant: 'destructive',
      });
      return;
    }
  
    try {
      // Crear notificación de solicitud de amistad
      await createNotification({
        recipientId: userToFollow.id, // Usuario que recibe la solicitud
        senderId: user.uid,          // Usuario que envía la solicitud
        senderName: user.displayName || 'Usuario desconocido',
        senderAvatar: user.photoURL || '/placeholder/avatar.png',
        type: 'friend_request',     // Tipo de notificación específico
        createdAt: new Date(),
      });
  
      toast({
        title: 'Solicitud enviada',
        description: `Solicitud de amistad enviada a ${userToFollow.nombre}.`,
        variant: 'success',
      });
    } catch (error) {
      console.error('Error al enviar la solicitud de amistad:', error);
      toast({
        title: 'Error',
        description: 'No se pudo enviar la solicitud. Intenta nuevamente.',
        variant: 'destructive',
      });
    }
  };
        

  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  const handleEditProfileClick = () => {
    setIsEditProfileOpen(true);
  };

  const handleCloseEditProfile = () => {
    setIsEditProfileOpen(false);
  };

  return (
    <nav className="bg-gradient-to-r from-orange-400 to-orange-600 fixed w-full z-50 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <h1 className="text-3xl lg:text-4xl font-bold text-white tracking-widest">Sportify</h1>
          <form onSubmit={handleSearch} className="flex-1 flex justify-center mx-4 relative">
            <div className="relative w-1/2">
              <input
                type="text"
                className="bg-white w-full px-4 py-2 text-sm rounded-full shadow focus:outline-none focus:ring-2 focus:ring-orange-300"
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
                        onClick={() => handleFollow(result)}
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
              className="text-white bg-transparent hover:bg-white hover:text-orange-500 transition-colors duration-200 relative"
              onClick={() => setNotificationsOpen(true)}
            >
              <Bell className="h-6 w-6" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
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
                <DropdownMenuItem className="cursor-pointer hover:bg-orange-50 focus:bg-orange-50" onClick={handleEditProfileClick}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Perfil</span>
                </DropdownMenuItem>
                {isAccountDeactivated ? (
                  <p>Tu cuenta ha sido desactivada. ¡Lamentamos verte partir!</p>
                ) : (
                  <>
                    <DropdownMenuItem
                      className="cursor-pointer hover:bg-orange-50 focus:bg-orange-50"
                      onClick={(e) => handleMenu(e)}
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Configuración</span>
                    </DropdownMenuItem>
                    {isDropdownOpen && (
                      <DesactivarCuenta onDeactivate={handleDeactivateAccount} />
                    )}
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer text-red-600 hover:bg-red-50 focus:bg-red-50" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar Sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {isEditProfileOpen && (
        <EditarPerfil user={user} onClose={handleCloseEditProfile} />
      )}
      <NotificacionesPanel
        open={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllRead={handleMarkAllRead}
      />
    </nav>
  );
};
