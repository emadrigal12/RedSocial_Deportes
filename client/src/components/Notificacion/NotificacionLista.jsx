  import { Button } from "@/components/ui/button";
  import { NotificacionItem } from './NotificacionItem';
  import { useAuth } from '../../context/AuthContext';
  import { useEffect, useState } from 'react';
  import { subscribeToUserNotifications, markAllNotificationsAsRead } from '../../config/Notificaciones/Notificaciones';
  
  export const NotificacionesLista = ({ open, onOpenChange }) => {
    const [notifications, setNotifications] = useState([]);
    const { user } = useAuth();
  
    useEffect(() => {
      if (user?.uid) {
        const unsubscribe = subscribeToUserNotifications(user.uid, (newNotifications) => {
          setNotifications(newNotifications);
        });
  
        return () => unsubscribe();
      }
    }, [user?.uid]);
  
    const handleMarkAllAsRead = async () => {
      if (user?.uid) {
        await markAllNotificationsAsRead(user.uid);
      }
    };
  
    const unreadCount = notifications.filter(n => !n.read).length;
  
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle className="flex justify-between items-center">
              Notificaciones
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  className="text-sm text-orange-500"
                  onClick={handleMarkAllAsRead}
                >
                  Marcar todas como leídas
                </Button>
              )}
            </SheetTitle>
          </SheetHeader>
          <div className="mt-4 space-y-2 max-h-[80vh] overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <NotificacionItem
                  key={notification.id}
                  notification={notification}
                />
              ))
            ) : (
              <p className="text-center text-gray-500 py-4">
                No tienes notificaciones
              </p>
            )}
          </div>
        </SheetContent>
      </Sheet>
    );
  };