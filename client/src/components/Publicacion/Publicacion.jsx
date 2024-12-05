import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MessageCircle, MoreVertical, Share2, ThumbsUp, Edit, Trash } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { 
  doc, 
  onSnapshot, 
  collection, 
  query, 
  orderBy,
  updateDoc,
  arrayUnion,
  arrayRemove,
  addDoc,
  getDocs,
  deleteDoc,
  serverTimestamp,
  increment
} from 'firebase/firestore';
import { db } from '../../lib/firebase/config';
import { useAuth } from '../../context/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {Comentarios} from '../Publicacion/Comentarios'
import {ComentarioDialogo} from '../Publicacion/ComentarioDialogo'
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";


export const Publicacion = ({ post, onPostUpdate }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);
  const [currentPost, setCurrentPost] = useState(post);
  const [isDeleted, setIsDeleted] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'Publicaciones', post.id), (doc) => {
      if (doc.exists()) {
        setCurrentPost({ id: doc.id, ...doc.data() });
        setIsLiked(doc.data().likedBy?.includes(user.uid) || false);
      } else {
        setIsDeleted(true);
      }
    });

    return () => unsubscribe();
  }, [post.id, user.uid]);

  useEffect(() => {
    if (!isDeleted) {
      const commentsQuery = query(
        collection(db, 'Publicaciones', post.id, 'comments'),
        orderBy('createdAt', 'desc')
      );

      const unsubscribe = onSnapshot(commentsQuery, (snapshot) => {
        const newComments = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setComments(newComments);
      });

      return () => unsubscribe();
    }
  }, [post.id, isDeleted]);

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = typeof timestamp === 'object' && timestamp.toDate ? 
      timestamp.toDate() : 
      new Date(timestamp);
    return format(date, "d 'de' MMMM 'a las' HH:mm", { locale: es });
  };

  const handleLike = async () => {
    try {
      const postRef = doc(db, 'Publicaciones', post.id);
      
      await updateDoc(postRef, {
        likedBy: isLiked ? arrayRemove(user.uid) : arrayUnion(user.uid),
        likes: increment(isLiked ? -1 : 1)
      });
      
    } catch (error) {
      console.error('Error al dar like:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo procesar tu like. Intenta nuevamente."
      });
    }
  };

  const handleComment = async () => {
    if (!newComment.trim()) return;
    
    try {
      const commentRef = collection(db, 'Publicaciones', post.id, 'comments');
      await addDoc(commentRef, {
        content: newComment,
        createdAt: serverTimestamp(),
        userId: user.uid,
        userName: user.displayName,
        userAvatar: user.photoURL,
      });

      const postRef = doc(db, 'Publicaciones', post.id);
      await updateDoc(postRef, {
        comments: increment(1)
      });

      setNewComment('');
    } catch (error) {
      console.error('Error al comentar:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo publicar tu comentario. Intenta nuevamente."
      });
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteDoc(doc(db, 'Publicaciones', post.id, 'comments', commentId));
      
      const postRef = doc(db, 'Publicaciones', post.id);
      await updateDoc(postRef, {
        comments: increment(-1)
      });
      toast({
        variant: "outline",
        title: "Éxito",
        description: "Comentario eliminado con éxito."
      });
    } catch (error) {
      console.error('Error al eliminar el comentario:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo eliminar el comentario. Intenta nuevamente."
      });
    }
  };

  const handleShare = async () => {
    try {
      const { id, likedBy, comments, ...shareablePost } = currentPost;
      
      const newPost = {
        ...shareablePost,
        userId: user.uid,
        userName: user.displayName,
        userAvatar: user.photoURL,
        createdAt: serverTimestamp(),
        likes: 0,
        comments: 0,
        likedBy: [],
        sharedFrom: {
          postId: post.id,
          userId: currentPost.userId,
          userName: currentPost.userName
        }
      };

      const docRef = await addDoc(collection(db, 'Publicaciones'), newPost);
      if (onPostUpdate) onPostUpdate();
      toast({
        title: "¡Publicación compartida!",
        description: "Tu contenido ha sido compartido exitosamente."
      });

      // Opcional: Desplazarse hasta la nueva publicación
      const element = document.getElementById(docRef.id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (error) {
      console.error('Error al compartir:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo compartir la publicación. Intenta nuevamente."
      });
    }
  };

  const handleDelete = async () => {
    try {
      const commentsQuery = query(collection(db, 'Publicaciones', post.id, 'comments'));
      const commentsSnapshot = await getDocs(commentsQuery);
      const deleteCommentPromises = commentsSnapshot.docs.map(doc => 
        deleteDoc(doc.ref)
      );
      await Promise.all(deleteCommentPromises);

      await deleteDoc(doc(db, 'Publicaciones', post.id));
      
      setIsDeleted(true);
      if (onPostUpdate) onPostUpdate();
      
      toast({
        title: "Publicación eliminada",
        description: "Tu publicación ha sido eliminada exitosamente."
      });
    } catch (error) {
      console.error('Error al eliminar la publicación:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo eliminar la publicación. Intenta nuevamente."
      });
    }
  };

  const handleSaveEdit = async () => {
    try {
      const postRef = doc(db, 'Publicaciones', post.id);
      await updateDoc(postRef, {
        content: editedContent
      });
      setIsEditing(false);
      
      toast({
        title: "Cambios guardados",
        description: "Tu publicación ha sido actualizada exitosamente."
      });
    } catch (error) {
      console.error('Error al editar la publicación:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron guardar los cambios. Intenta nuevamente."
      });
    }
  };

  if (isDeleted) {
    return null;
  }

  return (
    <Card className="mb-6">
      <CardHeader className="bg-gray-100 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={currentPost.userId == user.uid ? user.photoURL :currentPost.userAvatar || "/api/placeholder/32/32"} />
              <AvatarFallback>{currentPost.userName?.[0] || 'U'}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg">{currentPost.userName}</h3>
              <span className="text-sm text-gray-500">
                {formatTimestamp(currentPost.createdAt)}
              </span>
              {currentPost.sharedFrom && (
                <p className="text-sm text-gray-500 mt-1">
                  Compartido de {currentPost.sharedFrom.userName}
                </p>
              )}
            </div>
          </div>
          {currentPost.userId === user.uid && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  className="bg-white text-orange-500 border border-orange-500 hover:bg-orange-500 hover:text-white transition-all duration-300"
                  size="icon"
                >
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setIsEditing(true)}>
                  <Edit className="h-5 w-5 mr-2" />
                  Editar
                </DropdownMenuItem>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem
                      onSelect={(e) => e.preventDefault()}
                      className="text-red-600 hover:text-red-700 focus:text-red-700"
                    >
                      <Trash className="h-5 w-5 mr-2" />
                      Eliminar
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Eliminar publicación?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta acción no se puede deshacer. Se eliminarán también todos los comentarios asociados a esta publicación.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-red-500 hover:bg-red-600"
                        onClick={handleDelete}
                      >
                        Eliminar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {isEditing ? (
          <div className="flex items-center space-x-4">
            <input
              type="text"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="flex-1 bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
            <Button
              className="bg-orange-500 text-white hover:bg-orange-600 transition-all duration-300"
              onClick={handleSaveEdit}
            >
              Guardar
            </Button>
          </div>
        ) : (
          <p className="text-base leading-relaxed">{currentPost.content}</p>
        )}

        {currentPost.mediaUrl && (
          <div className="mt-4">
            {currentPost.mediaUrl.includes('video') ? (
              <video src={currentPost.mediaUrl} controls className="w-full rounded-lg" />
            ) : (
              <img
                src={currentPost.mediaUrl}
                alt="Contenido de la publicación"
                className="w-full rounded-lg"
              />
            )}
          </div>
        )}

        <div className="mt-6 flex items-center justify-between border-t pt-4">
          <Button
            className={`flex items-center space-x-2 ${
              isLiked
                ? 'bg-orange-500 text-white'
                : 'bg-white text-orange-500 border border-orange-500 hover:bg-orange-500 hover:text-white'
            } transition-all duration-300 px-4 py-2 rounded-md`}
            onClick={handleLike}
          >
            <ThumbsUp className="h-5 w-5" />
            <span>Me gusta ({currentPost.likes || 0})</span>
          </Button>

          <Button
            className={`flex items-center space-x-2 ${
              isCommenting
                ? 'bg-orange-500 text-white'
                : 'bg-white text-orange-500 border border-orange-500 hover:bg-orange-500 hover:text-white'
            } transition-all duration-300 px-4 py-2 rounded-md`}
            onClick={() => setIsCommenting(!isCommenting)}
          >
            <MessageCircle className="h-5 w-5" />
            <span>Comentar ({comments.length})</span>
          </Button>

          <Button
            className="flex items-center space-x-2 bg-white text-orange-500 border border-orange-500 hover:bg-orange-500 hover:text-white transition-all duration-300 px-4 py-2 rounded-md"
            onClick={handleShare}
          >
            <Share2 className="h-5 w-5" />
            <span>Compartir</span>
          </Button>
        </div>

        {comments.length > 0 && (
          <div className="mt-4 border-t pt-4">
            <h4 className="font-semibold text-gray-700 mb-3">
              Comentarios recientes
            </h4>
            {comments.slice(0, 3).map((comment) => (
              <Comentarios
                key={comment.id}
                comment={comment}
                onDelete={handleDeleteComment}
                canDelete={user.uid === comment.userId || user.uid === currentPost.userId}
                user = {user}
              />
            ))}
            
            {comments.length > 3 && (
              <ComentarioDialogo
                comments={comments}
                onDeleteComment={handleDeleteComment}
                currentUserId={user.uid}
                postUserId={currentPost.userId}
              />
            )}
          </div>
        )}

        {isCommenting && (
          <div className="mt-4 border-t pt-4">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Escribe un comentario..."
                className="flex-1 bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && newComment.trim()) {
                    handleComment();
                  }
                }}
              />
              <Button
                className="bg-orange-500 text-white hover:bg-orange-600 transition-all duration-300"
                onClick={handleComment}
                disabled={!newComment.trim()}
              >
                Comentar
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

Publicacion.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired,
    userName: PropTypes.string.isRequired,
    userAvatar: PropTypes.string,
    createdAt: PropTypes.object,
    content: PropTypes.string,
    mediaUrl: PropTypes.string,
    likes: PropTypes.number,
    likedBy: PropTypes.array,
    sharedFrom: PropTypes.shape({
      postId: PropTypes.string,
      userId: PropTypes.string,
      userName: PropTypes.string
    })
  }).isRequired,
  onPostUpdate: PropTypes.func
};