import PropTypes from 'prop-types';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Comentarios } from './Comentarios';


export const ComentarioDialogo = ({ comments, onDeleteComment, currentUserId, postUserId }) => {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button
            className="w-full bg-white text-orange-500 border border-orange-500 hover:bg-orange-500 hover:text-white transition-all duration-300 mt-2"
          >
            Ver todos los comentarios ({comments.length})
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Comentarios</DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto max-h-[60vh] pr-2 ">
            {comments.map((comment) => (
              <Comentarios
                key={comment.id}
                comment={comment}
                onDelete={onDeleteComment}
                canDelete={currentUserId === comment.userId || currentUserId === postUserId}
                isInModal={true}
              />
            ))}
          </div>
        </DialogContent>
      </Dialog>
    );
  };
  

  
ComentarioDialogo.propTypes = {
    comments: PropTypes.array.isRequired,
    onDeleteComment: PropTypes.func.isRequired,
    currentUserId: PropTypes.string.isRequired,
    postUserId: PropTypes.string.isRequired,
  };