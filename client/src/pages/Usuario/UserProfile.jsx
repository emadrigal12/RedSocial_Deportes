import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardHeader 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Flag,
  Users,
  MessageSquare,
  Calendar,
  MapPin,
  Mail,
  MoreVertical
} from 'lucide-react';
import { auth, db } from '../../lib/firebase/config';
import { 
  collection, 
  query, 
  where, 
  getDocs,
  getDoc,
  doc, 
  orderBy,
  addDoc,
  Timestamp 
} from 'firebase/firestore';
import { Navbar } from '../../components/Navegacion/Navbar';

const UserProfile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [reportReason, setReportReason] = useState('');
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
        try {
          // Obtener datos del usuario
          
          const userDoc = await getDoc(doc(db, 'Usuarios', userId));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            // Convertir createdAt a Date si existe

            const createdAt = userData.createdAt 
              ? (typeof userData.createdAt === 'object' && userData.createdAt.toDate 
                 ? userData.createdAt.toDate() 
                 : new Date(userData.createdAt))
              : new Date();
              
            setUser({ 
              id: userDoc.id, 
              ...userData,
              createdAt: createdAt 
            });
          console.log(userData);

          }
      
          // Para las publicaciones
          const postsQuery = query(
            collection(db, 'Publicaciones'),
            where('userId', '==', userId),
            orderBy('createdAt', 'desc')
          );
          const postsSnapshot = await getDocs(postsQuery);
          const postsData = postsSnapshot.docs.map(doc => {
            const data = doc.data();
            const createdAt = data.createdAt 
              ? (typeof data.createdAt === 'object' && data.createdAt.toDate 
                 ? data.createdAt.toDate() 
                 : new Date(data.createdAt))
              : new Date();
      
            return {
              id: doc.id,
              ...data,
              createdAt: createdAt
            };
          });
          setPosts(postsData);
          console.log(postsSnapshot.docs, 'posts');
          
          setLoading(false);
        } catch (error) {
          console.error('Error fetching user data:', error);
          setLoading(false);
        }
      };

    fetchUserData();
  }, [userId]);

  const handleReportUser = async () => {
    try {
      if (!reportReason) return;

      await addDoc(collection(db, 'Reportes'), {
        tipo: 'usuario',
        idReferencia: userId,
        reportedBy: auth.currentUser.uid,
        reason: reportReason,
        createdAt: Timestamp.now(),
        username: user.usuario,
        email: user.email,
        reportCount: 1,
        reportReasons: [reportReason]
      });

      setReportReason('');
      // Mostrar mensaje de éxito
    } catch (error) {
      console.error('Error reporting user:', error);
      // Mostrar mensaje de error
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <h1 className="text-2xl font-bold">Usuario no encontrado</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
          <Navbar className="shadow-sm" />
      {/* Banner y Foto de Perfil */}
      <div className="relative">
        <div className="h-48 bg-gradient-to-r from-orange-100 to-orange-200 rounded-t-lg"></div>
        <div className="absolute -bottom-16 left-8">
          <img
            src={user.fotoPerfil || '/api/placeholder/150/150'}
            alt={user.usuario}
            className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
          />
        </div>
      </div>

      {/* Información del Usuario */}
      <div className="mt-20 grid grid-cols-1 lg:grid-cols-3 gap-6 mx-2">
        {/* Columna Izquierda - Info del Usuario */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="flex flex-row justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold">{user.usuario}</h1>
                <p className="text-gray-500">{user.biografia || 'Sin biografía'}</p>
              </div>
              {!isCurrentUser && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Reportar Usuario</DialogTitle>
                      <DialogDescription>
                        Por favor, selecciona una razón para reportar a este usuario.
                      </DialogDescription>
                    </DialogHeader>
                    <Select onValueChange={setReportReason}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una razón" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="spam">Spam</SelectItem>
                        <SelectItem value="inappropriate">Contenido inapropiado</SelectItem>
                        <SelectItem value="harassment">Acoso</SelectItem>
                        <SelectItem value="fake">Cuenta falsa</SelectItem>
                      </SelectContent>
                    </Select>
                    <DialogFooter>
                      <Button variant="destructive" onClick={handleReportUser}>
                        <Flag className="mr-2 h-4 w-4" />
                        Reportar
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-gray-500" />
                  <span>{user.friendsCount || 0} amigos</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-gray-500" />
                  <span>{posts.length} publicaciones</span>
                </div>
                {user.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-gray-500" />
                    <span>{user.ubicacion}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-gray-500" />
                  <span>Se unió en {user.createdAt.toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-gray-500" />
                  <span>{user.email}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Columna Derecha - Publicaciones */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold mb-4">Publicaciones</h2>
          <div className="space-y-4">
            {posts.map(post => (
              <Card key={post.id} className="w-full">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <img
                      src={user.fotoPerfil || '/api/placeholder/40/40'}
                      alt={user.usuario}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold">{user.usuario}</h3>
                        <span className="text-sm text-gray-500">
                            {post.createdAt.toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700">{post.content}</p>
                      {post.imageUrl && (
                        <img
                          src={post.imageUrl}
                          alt="Post content"
                          className="mt-2 rounded-lg max-h-96 w-full object-cover"
                        />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;