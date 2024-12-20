import React, { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Publicacion } from '../Publicacion/Publicacion';
import { NotificacionItem } from './NotificacionItem'; 
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase/config';

export const NotificacionesPanel = ({ open, onClose, notifications = [], onMarkAllRead }) => {
  const panelRef = useRef();
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('pointerdown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('pointerdown', handleClickOutside);
    };
  }, [open, onClose]);

  const handleNotificationClick = async (notification) => {
    try {
      if (!notification || !notification.postId) {
        console.error('La notificación no tiene un postId válido:', notification);
        return;
      }

      setSelectedNotification(notification);
      setIsLoading(true);

      const postDoc = await getDoc(doc(db, 'Publicaciones', notification.postId));
      if (postDoc.exists()) {
        setSelectedPost({ id: postDoc.id, ...postDoc.data() });
      } else {
        console.error('No se encontró la publicación:', notification.postId);
        setSelectedPost(null);
      }
    } catch (error) {
      console.error('Error al cargar la publicación:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToNotifications = () => {
    setSelectedNotification(null);
    setSelectedPost(null);
  };

  if (!open) return null;

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
      <div
        ref={panelRef}
        role="dialog"
        aria-hidden={!open}
        aria-labelledby="notificaciones-panel-title"
        className={`bg-white w-full max-w-md h-full shadow-lg transform transition-transform duration-300 ease-in-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 id="notificaciones-panel-title" className="text-lg font-semibold">
            {selectedNotification ? 'Publicación' : 'Notificaciones'}
          </h2>
          <div className="flex items-center space-x-4">
            {!selectedNotification && unreadCount > 0 && (
              <Button
                variant="ghost"
                className="text-sm text-orange-500"
                onClick={onMarkAllRead}
              >
                Marcar todas como leídas
              </Button>
            )}
            <button
              onClick={onClose}
              aria-label="Cerrar panel de notificaciones"
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto h-[calc(100%-4rem)]">
          {selectedNotification ? (
            <>
              <Button
                variant="ghost"
                className="mb-4 text-sm"
                onClick={handleBackToNotifications}
              >
                &larr; Volver a Notificaciones
              </Button>
              {isLoading ? (
                <p className="text-center text-gray-500 py-8">Cargando publicación...</p>
              ) : selectedPost ? (
                <Publicacion post={selectedPost} />
              ) : (
                <p className="text-center text-gray-500 py-8">No se encontró la publicación.</p>
              )}
            </>
          ) : notifications.length > 0 ? (
            notifications.map((notification) => (
              <NotificacionItem
                key={notification.id}
                notification={notification}
                onClick={() => handleNotificationClick(notification)}
              />
            ))
          ) : (
            <p className="text-center text-gray-500 py-8">No tienes notificaciones</p>
          )}
        </div>
      </div>
    </div>
  );
};
