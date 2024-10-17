import PropTypes from 'prop-types';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export const Publicacion = ({ user, time, content, likes, comments }) => {
  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex items-start space-x-4">
          <Avatar>
            <AvatarImage src="/api/placeholder/32/32" />
            <AvatarFallback>MG</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{user}</h3>
              <span className="text-sm text-gray-500">{time}</span>
            </div>
            <p className="mt-2">{content}</p>
            <div className="mt-4 flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                Me gusta ({likes})
              </Button>
              <Button variant="ghost" size="sm">
                Comentar ({comments})
              </Button>
              <Button variant="ghost" size="sm">
                Compartir
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

Publicacion.propTypes = {
    user : PropTypes.string.isRequired,
    time : PropTypes.string.isRequired,
    content : PropTypes.string.isRequired,
    likes : PropTypes.number.isRequired,
    comments : PropTypes.string.isRequired
}