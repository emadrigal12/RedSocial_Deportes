import PropTypes from 'prop-types';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Trash } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
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

export const Comentarios = ({ comment, onDelete, canDelete, isInModal = false }) => {
    
  return (
    <div className={`flex items-start space-x-3 ${!isInModal ? 'mb-3 border-b pb-3 last:border-b-0' : 'p-3 hover:bg-gray-50 rounded-lg'}`}>
      <Avatar className="h-8 w-8">
        <AvatarImage src={comment.userAvatar || "/api/placeholder/32/32"} />
        <AvatarFallback>{comment.userName?.[0] || 'U'}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <h5 className="font-semibold text-gray-800">{comment.userName}</h5>
            <p className="text-sm text-gray-700">{comment.content}</p>
            <span className="text-xs text-gray-500">
              {format(
                typeof comment.createdAt === 'object' && comment.createdAt?.toDate ? 
                comment.createdAt.toDate() : 
                new Date(comment.createdAt),
                "d 'de' MMMM 'a las' HH:mm",
                { locale: es }
              )}
            </span>
          </div>
          {canDelete && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  size="icon"
                  className="h-8 w-8 bg-white text-red-600 hover:bg-red-50 focus:bg-red-50"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Eliminar comentario?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción no se puede deshacer.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-red-500 hover:bg-red-600"
                    onClick={() => onDelete(comment.id)}
                  >
                    Eliminar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>
    </div>
  );
};

Comentarios.propTypes = {
    comment: PropTypes.shape({
      id: PropTypes.string.isRequired,
      userId: PropTypes.string.isRequired,
      userName: PropTypes.string.isRequired,
      userAvatar: PropTypes.string,
      content: PropTypes.string.isRequired,
      createdAt: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    }).isRequired,
    onDelete: PropTypes.func.isRequired,
    canDelete: PropTypes.bool.isRequired,
    isInModal: PropTypes.bool,
  };