import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import NotificacionItem from './NotificacionItem';
import { useAuth } from '../../context/AuthContext';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase/config'; // Ruta a tu configuración de Firebase



export const NotificacionesLista = ({ open, onOpenChange }) => {
  const [notifications, setNotifications] = useState([]);
  const { user } = useAuth();

  // Conexión en tiempo real con Firestore para obtener notificaciones
  useEffect(() => {
    if (!user?.uid) return;

    const notificationsQuery = query(
      collection(db, 'Notificaciones'),
      where('recipientId', '==', user.uid) // Filtrar notificaciones solo para el usuario actual
    );

    const unsubscribe = onSnapshot(notificationsQuery, (snapshot) => {
      const fetchedNotifications = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNotifications(fetchedNotifications);
    });

    return () => unsubscribe(); // Limpiar la suscripción al desmontar
  }, [user?.uid]);

  // Marcar todas las notificaciones como leídas
  const handleMarkAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter((n) => !n.read);
      const updatePromises = unreadNotifications.map((notif) => {
        const notifRef = doc(db, 'Notificaciones', notif.id);
        return updateDoc(notifRef, { read: true });
      });

      await Promise.all(updatePromises); // Esperar a que todas las actualizaciones terminen
    } catch (error) {
      console.error('Error al marcar notificaciones como leídas:', error);
    }
  };

  // Contar las notificaciones no leídas
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className={`fixed top-0 right-0 w-full max-w-md bg-white shadow-lg ${open ? 'block' : 'hidden'}`}>
      <div className="p-4 flex items-center justify-between border-b">
        <h2 className="text-lg font-semibold">Notificaciones</h2>
        {unreadCount > 0 && (
          <Button
            variant="ghost"
            className="text-sm text-orange-500"
            onClick={handleMarkAllAsRead}
          >
            Marcar todas como leídas
          </Button>
        )}
      </div>
      <div className="mt-4 space-y-2 max-h-[80vh] overflow-y-auto">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <NotificacionItem key={notification.id} notification={notification} />
          ))
        ) : (
          <p className="text-center text-gray-500 py-4">
            No tienes notificaciones
          </p>
        )}
      </div>
    </div>
  );
};
