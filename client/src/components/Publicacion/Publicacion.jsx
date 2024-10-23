import PropTypes from 'prop-types';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MessageCircle, MoreVertical, Share2, ThumbsUp } from 'lucide-react';

export const Publicacion = ({ post }) => {
    return (
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src="/api/placeholder/32/32" />
              <AvatarFallback>MG</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{post.user}</h3>
                  <span className="text-sm text-gray-500">{post.time}</span>
                </div>
                <Button className="hover:bg-orange-50 hover:bg-orange-600 bg-orange-500" size="icon">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </div>
              <p className="mt-4 text-base leading-relaxed">{post.content}</p>
              <div className="mt-6 flex items-center space-x-6 border-t pt-4">
                <Button 
                  className="flex items-center space-x-2 hover:bg-orange-50 hover:bg-orange-600 bg-orange-500 transition-colors"
                >
                  <ThumbsUp className="h-5 w-5" />
                  <span>Me gusta ({post.likes})</span>
                </Button>
                <Button 
                  className="flex items-center space-x-2 hover:bg-orange-50 hover:bg-orange-600 bg-orange-500 transition-colors"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>Comentar ({post.comments})</span>
                </Button>
                <Button 
                  
                  className="flex items-center space-x-2 hover:bg-orange-50 hover:bg-orange-600 bg-orange-500 transition-colors"
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
    user: PropTypes.string.isRequired,      
    time: PropTypes.string.isRequired,      
    content: PropTypes.string.isRequired,   
    likes: PropTypes.number.isRequired,     
    comments: PropTypes.number.isRequired 
  }).isRequired
};
