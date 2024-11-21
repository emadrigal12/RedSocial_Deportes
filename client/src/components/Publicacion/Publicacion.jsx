import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MessageCircle, MoreVertical, Share2, ThumbsUp, Edit, Trash } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { addComment, toggleLike, sharePost, deletePost, updatePost, fetchComments } from '../../config/Publicaciones/Publicacion';
import { useAuth } from '../../context/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Publicacion = ({ post }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);
  const { user } = useAuth();

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    return format(date, "d 'de' MMMM 'a las' HH:mm", { locale: es });
  };

  const handleLike = async () => {
    try {
      await toggleLike(post.id, user.uid);
      setIsLiked(!isLiked);
      setEditedContent({ ...post, likes: isLiked ? post.likes - 1 : post.likes + 1 });
      
    } catch (error) {
      console.error('Error al dar like:', error);
    }
  };

  const handleComment = async () => {
    try {
      await addComment(user, post.id, newComment);
      setNewComment('');
    } catch (error) {
      console.error('Error al comentar:', error);
    }
  };

  const handleShare = async () => {
    try {
      console.log(post);
      
      await sharePost(user, post);
      alert('¡Publicación compartida!');
    } catch (error) {
      console.error('Error al compartir:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await deletePost(post.id);
    } catch (error) {
      console.error('Error al eliminar la publicación:', error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    try {
      console.log(post);
      
      await updatePost(post.id, editedContent);
      setIsEditing(false);
    } catch (error) {
      console.error('Error al editar la publicación:', error);
    }
  };

  useEffect(() => {
    fetchComments(post.id, setComments);
  }, [post.id]);

  return (
    <Card className="mb-6">
      <CardHeader className="bg-gray-100 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={post.userAvatar || "/api/placeholder/32/32"} />
              <AvatarFallback>{post.userName?.[0] || 'U'}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg">{post.userName}</h3>
              <span className="text-sm text-gray-500">
                {formatTimestamp(post.createdAt)}
              </span>
            </div>
          </div>
          {post.userId === user.uid && (
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
                <DropdownMenuItem onClick={handleEdit}>
                  <Edit className="h-5 w-5 mr-2" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete}>
                  <Trash className="h-5 w-5 mr-2" />
                  Eliminar
                </DropdownMenuItem>
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
          <p className="text-base leading-relaxed">{post.content}</p>
        )}
  
        {post.mediaUrl && (
          <div className="mt-4">
            {post.mediaUrl.includes('video') ? (
              <video src={post.mediaUrl} controls className="w-full rounded-lg" />
            ) : (
              <img
                src={post.mediaUrl}
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
            <span>Me gusta ({post.likes})</span>
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
            <span>Comentar</span>
          </Button>
  
          <Button
            className="flex items-center space-x-2 bg-white text-orange-500 border border-orange-500 hover:bg-orange-500 hover:text-white transition-all duration-300 px-4 py-2 rounded-md"
            onClick={handleShare}
          >
            <Share2 className="h-5 w-5" />
            <span>Compartir</span>
          </Button>
        </div>
  
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
                  if (e.key === 'Enter') {
                    handleComment();
                  }
                }}
              />
              <Button
                className="bg-orange-500 text-white hover:bg-orange-600 transition-all duration-300 px-4 py-2 rounded-md"
                onClick={handleComment}
              >
                Comentar
              </Button>
            </div>
          </div>
        )}
  
        {comments.length > 0 && (
          <div className="mt-4 border-t pt-4">
            <h4 className="font-semibold text-gray-700 mb-3">Comentarios</h4>
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="flex items-start space-x-3 mb-3 border-b pb-3 last:border-b-0"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={comment.userAvatar || "/api/placeholder/32/32"} />
                  <AvatarFallback>{comment.userName[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h5 className="font-semibold text-gray-800">{comment.userName}</h5>
                  <p className="text-sm text-gray-700">{comment.content}</p>
                </div>
              </div>
            ))}
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
    createdAt: PropTypes.object.isRequired,
    content: PropTypes.string,
    mediaUrl: PropTypes.string,
    likes: PropTypes.number.isRequired,
    comments: PropTypes.number.isRequired,
  }).isRequired
};