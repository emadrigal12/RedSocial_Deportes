import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { NOTIFICATION_TYPES } from '../../config/Notificaciones/Notificaciones';

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
      default:
        return 'interactuó con tu contenido';
    }
  };

  return (
    <div className={`p-4 hover:bg-gray-50 cursor-pointer flex items-center space-x-4 ${
      !notification.read ? 'bg-orange-50' : ''
    }`}>
      <Avatar className="h-10 w-10">
        <AvatarImage src={notification.senderAvatar} />
        <AvatarFallback>{notification.senderName[0]}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <p className="text-sm">
          <span className="font-semibold">{notification.senderName}</span>{' '}
          {getNotificationMessage()}
        </p>
        <span className="text-xs text-gray-500">
          {format(new Date(notification.createdAt?.toDate()), "d 'de' MMMM 'a las' HH:mm", { locale: es })}
        </span>
      </div>
    </div>
  );
};