import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, 
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, 
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog";
import { Ban, Trash2, X } from 'lucide-react';
import { auth, db } from '../../lib/firebase/config';
import { 
  collection, 
  doc, 
  deleteDoc, 
  query, 
  where, 
  getDocs,
  updateDoc,
  getDoc 
} from 'firebase/firestore';
import { useToast } from "@/hooks/use-toast"

const AdminDashboard = () => {
  const [reportedUsers, setReportedUsers] = useState([]);
  const [reportedPosts, setReportedPosts] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchReportedData = async () => {
      try {
        const usersQuery = query(collection(db, 'Reportes'), where('tipo', '==', 'usuario'));
        const usersSnapshot = await getDocs(usersQuery);
        const reportedUsers = usersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setReportedUsers(reportedUsers);

        const postsQuery = query(collection(db, 'Reportes'), where('tipo', '==', 'publicacion'));
        const postsSnapshot = await getDocs(postsQuery);
        const reportedPosts = postsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setReportedPosts(reportedPosts);
      } catch (error) {
        console.error('Error fetching reported data:', error);
      }
    };

    fetchReportedData();
  }, []);

  const handleBanUser = async (userId) => {
    try {
      const reportRef = doc(db, 'Reportes', userId);
      const reportDoc = await getDoc(reportRef);
      
      if (reportDoc.exists()) {
        const { idReferencia } = reportDoc.data();
        
        const userRef = doc(db, 'Usuarios', idReferencia);
        await updateDoc(userRef, {
          estado: 'banned',
          banDate: new Date().toISOString()
        });
  
        const userReportQuery = query(
          collection(db, 'Reportes'), 
          where('tipo', '==', 'usuario'), 
          where('idReferencia', '==', idReferencia)
        );
        const userReportSnapshot = await getDocs(userReportQuery);
        await Promise.all(userReportSnapshot.docs.map(doc => deleteDoc(doc.ref)));
  
        setReportedUsers(reportedUsers.filter(user => user.id !== userId));
  
        toast({
          variant: "outline",
          title: "Éxito",
          description: "Usuario baneado con éxito"
        });
      }
    } catch (error) {
      console.error('Error banning user:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error al banear usuario"
      });
    }
  };

  const handleDismissReport = async (type, reportId) => {
    try {
      const reportRef = doc(db, 'Reportes', reportId);
      await deleteDoc(reportRef);
  
      if (type === 'usuario') {
        setReportedUsers(reportedUsers.filter(user => user.id !== reportId));
      } else if (type === 'publicacion') {
        setReportedPosts(reportedPosts.filter(post => post.id !== reportId));
      }
  
      console.log(`Reporte de ${type} descartado exitosamente`);
    } catch (error) {
      console.error(`Error al descartar reporte de ${type}:`, error);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      
      const reportRef = doc(db, 'Reportes', postId);
      const reportDoc = await getDoc(reportRef);
      if (reportDoc.exists()) {
        const { idReferencia } = reportDoc.data();
        const postRef = doc(db, 'Publicaciones', idReferencia);
        await deleteDoc(postRef);
        await deleteDoc(reportRef);
        setReportedPosts(reportedPosts.filter(post => post.id !== postId));
        toast({
          variant: "outline",
          title: "Éxito",
          description: `Publicación eliminada con éxito`
        });
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Error al eliminar publicación`
      });
    }
  };
  return (
    <div className="container min-h-screen mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Panel de Administración</h1>
      
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="users">Usuarios Reportados</TabsTrigger>
          <TabsTrigger value="posts">Publicaciones Reportadas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reportedUsers.map(user => (
              <Card key={user.id} className="w-full">
                <CardHeader>
                  <CardTitle>{user.username}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Email: {user.email}</p>
                  <p>Reportes: {user.reportCount}</p>
                  <div className="mt-2">
                    <h4 className="font-semibold">Razones:</h4>
                    <ul className="text-sm text-red-600">
                      {user.reportReasons.map((reason, index) => (
                        <li key={index}>{reason}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          <Ban className="mr-2 h-4 w-4" /> Banear Usuario
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Estás seguro de banear a este usuario?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta acción eliminará al usuario de la plataforma.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleBanUser(user.id)}>
                            Banear
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDismissReport('user', user.id)}
                    >
                      <X className="mr-2 h-4 w-4" /> Descartar Reporte
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="posts">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reportedPosts.map(post => (
              <Card key={post.id} className="w-full">
                <CardHeader>
                  <CardTitle>Publicación Reportada</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-2">{post.content}</p>
                  <p>ID de Usuario: {post.userId}</p>
                  <p>Reportes: {post.reportCount}</p>
                  
                  <div className="mt-2">
                    <h4 className="font-semibold">Razones:</h4>
                    <ul className="text-sm text-red-600">
                      {post.reportReasons?.map((reason, index) => (
                        <li key={index}>{reason}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="mr-2 h-4 w-4" /> Eliminar Publicación
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Estás seguro de eliminar esta publicación?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta acción eliminará la publicación permanentemente.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeletePost(post.id)}>
                            Eliminar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDismissReport('post', post.id)}
                    >
                      <X className="mr-2 h-4 w-4" /> Descartar Reporte
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;