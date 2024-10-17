import { Card, CardContent } from "@/components/ui/card";

export const NotificationPanel = () => {
  const notifications = [
    { id: 1, text: 'Juan te envió una solicitud de amistad', time: '5m' },
    { id: 2, text: 'María comentó tu publicación', time: '10m' },
  ];

  return (
    <div className="md:col-span-1">
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold mb-4">Notificaciones</h3>
          {notifications.map(notification => (
            <div key={notification.id} className="py-2 border-b last:border-0">
              <p className="text-sm">{notification.text}</p>
              <span className="text-xs text-gray-500">{notification.time}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};