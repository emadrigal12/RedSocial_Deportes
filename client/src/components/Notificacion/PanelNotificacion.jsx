import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { CheckCircleIcon, BellIcon } from "@heroicons/react/outline"; 

export const PanelNotificacion = () => {
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Juan te envió una solicitud de amistad', time: '5m', isRead: false },
    { id: 2, text: 'María comentó tu publicación', time: '10m', isRead: false },
  ]);

  useEffect(() => {
    // Aquí agregaria websocket
  }, []);

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, isRead: true }))
    );
  };

  return (
    <div className="hidden lg:block md:col-span-1">
      <Card className="sticky top-24 shadow-lg rounded-lg overflow-hidden">
        <CardContent className="p-6 bg-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg text-gray-800">Notificaciones</h3>
            <button 
              onClick={markAllAsRead} 
              className="text-sm font-semibold text-blue-600 hover:text-blue-500 transition-colors"
            >
              Marcar todo como leído
            </button>
          </div>
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => markAsRead(notification.id)}
                className={`p-4 rounded-lg flex items-start space-x-3 cursor-pointer transition-colors ${
                  notification.isRead ? 'bg-gray-50' : 'bg-blue-50'
                } hover:bg-gray-100`}
              >
                <div className="flex-shrink-0">
                  {notification.isRead ? (
                    <CheckCircleIcon className="h-6 w-6 text-green-500" />
                  ) : (
                    <BellIcon className="h-6 w-6 text-blue-600" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {notification.text}
                  </p>
                  <span className="text-xs text-gray-500 mt-1 block">{notification.time}</span>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-6 text-sm font-semibold text-blue-600 hover:text-blue-500 transition-colors w-full text-center">
            Ver todas las notificaciones
          </button>
        </CardContent>
      </Card>
    </div>
  );
};
