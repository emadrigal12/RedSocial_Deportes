import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { CheckCircleIcon, BellIcon } from "@heroicons/react/outline";
import { db } from "@/lib/firebase/config"; 
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";

export const PanelNotificacion = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const notificationsRef = collection(db, "perfiles");

    const unsubscribe = onSnapshot(notificationsRef, (snapshot) => {
      const notificaciones = snapshot.docs
        .filter((doc) => doc.data().Tipo === "notificacion") // Filtrar las notificaciones
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      setNotifications(notificaciones);
    });

    return () => unsubscribe();
  }, []);

  const markAsRead = async (id) => {
    const notificationRef = doc(db, "perfiles", id);

    try {
      await updateDoc(notificationRef, { isRead: true });
    } catch (error) {
      console.error("Error al marcar como leída:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const updates = notifications.map((notification) =>
        updateDoc(doc(db, "perfiles", notification.id), { isRead: true })
      );
      await Promise.all(updates);
    } catch (error) {
      console.error("Error al marcar todas como leídas:", error);
    }
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
                key={notification.ID_Notificacion}
                onClick={() => markAsRead(notification.ID_Notificacion)}
                className={`p-4 rounded-lg flex items-start space-x-3 cursor-pointer transition-colors ${
                  notification.isRead ? "bg-gray-50" : "bg-blue-50"
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
                  <p className="text-sm font-medium text-gray-800">{notification.Mensaje}</p>
                  <span className="text-xs text-gray-500 mt-1 block">{notification.Fecha}</span>
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

