import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { NOTIFICATION_TYPES } from '../../config/Notificaciones/Notificaciones';
import { updateDoc, doc, arrayUnion, deleteDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase/config';
import { toast } from '@/hooks/use-toast';

export const NotificacionItem = ({ notification }) => {
  const getNotificationMessage = () => {
    switch (notification.type) {
      case NOTIFICATION_TYPES.LIKE:
        return 'le dio me gusta a tu publicación';
      case NOTIFICATION_TYPES.COMMENT:
        return 'comentó en tu publicación';
      case NOTIFICATION_TYPES.SHARE:
        return 'compartió tu publicación';
      case NOTIFICATION_TYPES.FOLLOW:
        return 'comenzó a seguirte';
        case 'friend_request':
          return 'te envió una solicitud de amistad';
      default:
        return 'interactuó con tu contenido';
    }
  };

  const handleAccept = async () => {
    try {
      // Agregar al destinatario a la lista de "seguidos" del remitente
      const senderRef = doc(db, 'Usuarios', notification.senderId);
      await updateDoc(senderRef, {
        seguidos: arrayUnion(notification.recipientId), // Agregar destinatario
      });
  
      // Eliminar la notificación después de aceptar
      await deleteDoc(doc(db, 'Notificaciones', notification.id));
  
      toast({
        title: 'Solicitud aceptada',
        description: `${notification.senderName} ahora es tu amigo.`,
        variant: 'success',
      });
    } catch (error) {
      console.error('Error al aceptar la solicitud:', error);
      toast({
        title: 'Error',
        description: 'Hubo un problema al aceptar la solicitud. Intenta nuevamente.',
        variant: 'destructive',
      });
    }
  };
  
  const handleReject = async () => {
    try {
      if (!notification.id) {
        throw new Error('ID de notificación faltante');
      }

      // Eliminar la notificación después de rechazar
      await deleteDoc(doc(db, 'Notificaciones', notification.id));

      toast({
        title: 'Solicitud rechazada',
        description: `Rechazaste la solicitud de ${notification.senderName}.`,
        variant: 'info',
      });
    } catch (error) {
      console.error('Error al rechazar la solicitud:', error);
      toast({
        title: 'Error',
        description: 'Hubo un problema al rechazar la solicitud. Intenta nuevamente.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div
      className={`p-4 hover:bg-gray-50 cursor-pointer flex items-center space-x-4 ${
        !notification.read ? 'bg-orange-50' : ''
      }`}
    >
      {/* Avatar del remitente */}
      <Avatar className="h-10 w-10">
        <AvatarImage src={notification.senderAvatar || "/placeholder/avatar.png"} />
        <AvatarFallback>
          {notification.senderName ? notification.senderName[0] : 'N/A'}
        </AvatarFallback>
      </Avatar>

      {/* Mensaje de la notificación */}
      <div className="flex-1">
        <p className="text-sm">
          <span className="font-semibold">{notification.senderName || 'Usuario desconocido'}</span>{' '}
          {getNotificationMessage()}
        </p>
        <span className="text-xs text-gray-500">
          {notification.createdAt?.toDate
            ? format(new Date(notification.createdAt.toDate()), "d 'de' MMMM 'a las' HH:mm", { locale: es })
            : 'Fecha desconocida'}
        </span>
      </div>

      {/* Botones de acción para solicitudes de amistad */}
      {notification.type === 'friend_request' && (
        <div className="flex space-x-2">
          <button
            onClick={handleAccept}
            className="px-3 py-1 text-sm font-medium text-white bg-green-500 rounded-full hover:bg-green-600"
          >
            Aceptar
          </button>
          <button
            onClick={handleReject}
            className="px-3 py-1 text-sm font-medium text-white bg-red-500 rounded-full hover:bg-red-600"
          >
            Rechazar
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificacionItem;