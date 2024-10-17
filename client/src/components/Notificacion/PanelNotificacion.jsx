import { Card, CardContent } from "@/components/ui/card";

export const PanelNotificacion = () => {
  const notifications = [
    { id: 1, text: 'Juan te envió una solicitud de amistad', time: '5m' },
    { id: 2, text: 'María comentó tu publicación', time: '10m' },
  ];

  return (
    <div className="hidden lg:block md:col-span-1">
      <Card className="sticky top-24">
        <CardContent className="p-6">
          <h3 className="font-semibold text-lg mb-4">Notificaciones</h3>
          <div className="space-y-4">
            {notifications.map(notification => (
              <div 
                key={notification.id} 
                className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <p className="text-sm font-medium">{notification.text}</p>
                <span className="text-xs text-gray-500 mt-1 block">{notification.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};