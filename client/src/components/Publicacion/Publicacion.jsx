import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MessageCircle, MoreVertical, Share2, ThumbsUp } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import ReportPublicacion from './ReportPublicacion';

export const Publicacion = ({ post }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportSent, setReportSent] = useState(false); // Estado para verificar si el reporte fue enviado
  const [interactionsDisabled, setInteractionsDisabled] = useState(false); // Para desactivar botones cuando se envía el reporte
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    return format(date, "d 'de' MMMM 'a las' HH:mm", { locale: es });
  };

  const handleLike = async () => {
    try {
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Error al dar like:', error);
    }
  };

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const handleReportPost = (postId) => {
    console.log("Abriendo formulario para reportar:", postId);
    setReportOpen(true); // Abre el formulario de reporte
  };

  const handleReportSubmit = () => {
    // Simulando el envío del reporte
    console.log("Reporte enviado");
    setReportSent(true); // Marca que el reporte ha sido enviado
    setInteractionsDisabled(true); // Desactiva las interacciones (botones)
    setReportOpen(false); // Cierra el formulario de reporte
  };

  return (
    <Card className="mb-6 relative">
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
              <div className="relative" ref={menuRef}>
                <Button
                  className="bg-white text-orange-500 border border-orange-500 hover:bg-orange-500 hover:text-white transition-all duration-300"
                  size="icon"
                  onClick={handleMenuToggle}
                  disabled={interactionsDisabled} // Desactiva el botón si se ha enviado el reporte
                >
                  <MoreVertical className="h-5 w-5" />
                </Button>
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-lg z-50 border">
                    <ul className="py-1">
                      <li className="hover:bg-gray-100">
                        <button
                          onClick={() => handleReportPost(post.id)}
                          className="w-full text-left px-4 py-2 text-gray-700 hover:text-orange-500"
                          disabled={interactionsDisabled} // Desactiva el botón si se ha enviado el reporte
                        >
                          Reportar Publicación
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
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
                }`}
                onClick={handleLike}
                disabled={interactionsDisabled} // Desactiva el botón si se ha enviado el reporte
              >
                <ThumbsUp className="h-5 w-5" />
                <span>Me gusta ({post.likes})</span>
              </Button>

              <Button
                className="flex items-center space-x-2 bg-white text-orange-500 border border-orange-500 hover:bg-orange-500 hover:text-white transition-all duration-300"
                disabled={interactionsDisabled} // Desactiva el botón si se ha enviado el reporte
              >
                <MessageCircle className="h-5 w-5" />
                <span>Comentar ({post.comments})</span>
              </Button>

              <Button
                className="flex items-center space-x-2 bg-white text-orange-500 border border-orange-500 hover:bg-orange-500 hover:text-white transition-all duration-300"
                disabled={interactionsDisabled} // Desactiva el botón si se ha enviado el reporte
              >
                <Share2 className="h-5 w-5" />
                <span>Compartir</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Renderiza el formulario de reporte si está abierto */}
        {reportOpen && !reportSent && (
          <ReportPublicacion
            postId={post.id}
            closeReport={() => setReportOpen(false)} 
            onSubmit={handleReportSubmit} // Maneja el envío del reporte
          />
        )}

        {/* Mostrar mensaje de éxito si el reporte fue enviado */}
        {reportSent && (
          <div className="mt-4 text-green-500 font-semibold">
            ¡Gracias por reportar! Tu reporte ha sido enviado correctamente.
          </div>
        )}
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
  }).isRequired,
};

