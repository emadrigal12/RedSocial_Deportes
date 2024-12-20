import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { NotificacionItem } from './NotificacionItem';
import { Button } from "@/components/ui/button";

export const NotificacionesPanel = ({ open, onClose, notifications, onMarkAllRead }) => {
  const panelRef = useRef();

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

  if (!open) return null;

  const unreadCount = notifications?.filter(n => !n.read).length || 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
      <div
        ref={panelRef}
        className="bg-white w-full max-w-md h-full shadow-lg transform transition-transform duration-300 ease-in-out"
        role="dialog"
        aria-hidden={!open}
        aria-labelledby="notificaciones-titulo"
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 id="notificaciones-titulo" className="text-lg font-semibold">Notificaciones</h2>
          <div className="flex items-center space-x-4">
            {unreadCount > 0 && (
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
              className="p-1 hover:bg-gray-100 rounded-full"
              aria-label="Cerrar panel de notificaciones"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto h-[calc(100%-4rem)]">
          {notifications === null ? (
            <p className="text-center text-gray-500 py-8">Cargando notificaciones...</p>
          ) : notifications.length > 0 ? (
            notifications.map((notification) => (
              <NotificacionItem key={notification.id} notification={notification} />
            ))
          ) : (
            <p className="text-center text-gray-500 py-8">No tienes notificaciones</p>
          )}
        </div>
      </div>
    </div>
  );
};
