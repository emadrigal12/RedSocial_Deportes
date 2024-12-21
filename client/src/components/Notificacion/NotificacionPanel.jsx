import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { doc, updateDoc } from 'firebase/firestore';
import { NotificacionItem } from './NotificacionItem';

import { db } from '../../lib/firebase/config'; // Ajusta la ruta según tu configuración


export const NotificacionesPanel = ({ open, onClose, notifications, onMarkAllRead }) => {
  const panelRef = useRef();

  // Manejo para cerrar el panel al hacer clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, onClose]);

  // Si el panel no está abierto, no renderizar nada
  if (!open) return null;

  // Calcular el número de notificaciones no leídas
  const unreadCount = notifications.filter(n => !n.read).length;

  // Función para marcar una notificación como leída
  const markAllNotificationsAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter((n) => !n.read);
      await Promise.all(
        unreadNotifications.map((notification) => {
          const notificationRef = doc(db, 'Notificaciones', notification.id);
          return updateDoc(notificationRef, { read: true });
        })
      );
      onMarkAllRead(); // Llama al callback para actualizar la interfaz
    } catch (error) {
      console.error('Error al marcar notificaciones como leídas:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
      <div
        ref={panelRef}
        className="bg-white w-full max-w-md h-full shadow-lg transform transition-transform duration-300 ease-in-out"
        style={{
          animation: open ? 'slideIn 0.3s ease-out' : 'slideOut 0.3s ease-in'
        }}
      >
        {/* Encabezado del panel */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Notificaciones</h2>
          <div className="flex items-center space-x-4">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                className="text-sm text-orange-500"
                onClick={markAllNotificationsAsRead} // Llama a la función para marcar como leídas
              >
                Marcar todas como leídas
              </Button>
            )}
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Contenido del panel */}
        <div className="overflow-y-auto h-[calc(100%-4rem)]">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <NotificacionItem
                key={notification.id}
                notification={notification}
              />
            ))
          ) : (
            <p className="text-center text-gray-500 py-8">
              No tienes notificaciones
            </p>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }

        @keyframes slideOut {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
};
