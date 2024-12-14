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
import { auth , db } from '../../lib/firebase/config'
import { collection, doc, deleteDoc, addDoc, query, where, getDocs } from 'firebase/firestore';



const AdminDashboard = () => {
  const [reportedUsers, setReportedUsers] = useState([]);
  const [reportedPosts, setReportedPosts] = useState([]);

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
      const userReportQuery = query(collection(db, 'Reportes'), where('tipo', '==', 'usuario'), where('idReferencia', '==', userId));
      const userReportSnapshot = await getDocs(userReportQuery);
      await Promise.all(userReportSnapshot.docs.map(doc => deleteDoc(doc.ref)));

      setReportedUsers(reportedUsers.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Error banning user:', error);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      // Delete the post's report from the Reportes collection
      const postReportQuery = query(collection(db, 'Reportes'), where('tipo', '==', 'publicacion'), where('idReferencia', '==', postId));
      const postReportSnapshot = await getDocs(postReportQuery);
      await Promise.all(postReportSnapshot.docs.map(doc => deleteDoc(doc.ref)));

      // Remove the post from the reportedPosts state
      setReportedPosts(reportedPosts.filter(post => post.id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleDismissReport = async (type, id) => {
    try {
      // Delete the report from the Reportes collection
      const reportQuery = query(collection(db, 'Reportes'), where('tipo', '==', type), where('idReferencia', '==', id));
      const reportSnapshot = await getDocs(reportQuery);
      await Promise.all(reportSnapshot.docs.map(doc => deleteDoc(doc.ref)));

      // Remove the item from the corresponding state
      if (type === 'usuario') {
        setReportedUsers(reportedUsers.filter(user => user.id !== id));
      } else {
        setReportedPosts(reportedPosts.filter(post => post.id !== id));
      }
    } catch (error) {
      console.error(`Error dismissing ${type} report:`, error);
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