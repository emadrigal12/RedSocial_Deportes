import { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MessageCircle, MoreVertical, Share2, ThumbsUp } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const Publicacion = ({ post }) => {
  const [isLiked, setIsLiked] = useState(false);

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    return format(date, "d 'de' MMMM 'a las' HH:mm", { locale: es });
  };

  const handleLike = async () => {
    try {
      // Implementar la lógica del like
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Error al dar like:', error);
    }
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={post.userAvatar || "/api/placeholder/32/32"} />
            <AvatarFallback>{post.userName?.[0] || 'U'}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">{post.userName}</h3>
                <span className="text-sm text-gray-500">
                  {formatTimestamp(post.createdAt)}
                </span>
              </div>
              <Button 
                className="bg-white text-orange-500 border border-orange-500 hover:bg-orange-500 hover:text-white transition-all duration-300" 
                size="icon"
              >
                <MoreVertical className="h-5 w-5" />
              </Button>
            </div>
            
            <p className="mt-4 text-base leading-relaxed">{post.content}</p>
            
            {post.mediaUrl && (
              <div className="mt-4">
                {post.mediaUrl.includes('video') ? (
                  <video 
                    src={post.mediaUrl} 
                    controls 
                    className="w-full rounded-lg"
                  />
                ) : (
                  <img 
                    src={post.mediaUrl} 
                    alt="Contenido de la publicación" 
                    className="w-full rounded-lg"
                  />
                )}
              </div>
            )}

            <div className="mt-6 flex items-center space-x-6 border-t pt-4">
              <Button 
                className={`flex items-center space-x-2 ${
                  isLiked 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-white text-orange-500 border border-orange-500 hover:bg-orange-500 hover:text-white'
                } transition-all duration-300`}
                onClick={handleLike}
              >
                <ThumbsUp className="h-5 w-5" />
                <span>Me gusta ({post.likes})</span>
              </Button>
              
              <Button 
                className="flex items-center space-x-2 bg-white text-orange-500 border border-orange-500 hover:bg-orange-500 hover:text-white transition-all duration-300"
              >
                <MessageCircle className="h-5 w-5" />
                <span>Comentar ({post.comments})</span>
              </Button>
              
              <Button 
                className="flex items-center space-x-2 bg-white text-orange-500 border border-orange-500 hover:bg-orange-500 hover:text-white transition-all duration-300"
              >
                <Share2 className="h-5 w-5" />
                <span>Compartir</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

Publicacion.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.string.isRequired,
    userName: PropTypes.string.isRequired,
    userAvatar: PropTypes.string,
    createdAt: PropTypes.object.isRequired,
    content: PropTypes.string,
    mediaUrl: PropTypes.string,
    likes: PropTypes.number.isRequired,
    comments: PropTypes.number.isRequired,
  }).isRequired
};