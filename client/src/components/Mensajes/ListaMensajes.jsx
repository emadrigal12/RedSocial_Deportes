import PropTypes from 'prop-types';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare } from 'lucide-react';

const chatsData = [
  {
    id: 1,
    name: "Juan Pérez",
    lastMessage: "¿Viste el partido de ayer?",
    time: "5m",
    unread: 2,
    avatar: "/api/placeholder/40/40"
  },
  {
    id: 2,
    name: "María García",
    lastMessage: "¡Gracias por el comentario!",
    time: "10m",
    unread: 0,
    avatar: "/api/placeholder/40/40"
  },
  {
    id: 3,
    name: "Carlos López",
    lastMessage: "¿Cuándo es el próximo evento?",
    time: "1h",
    unread: 1,
    avatar: "/api/placeholder/40/40"
  }
];

const ListaChats = ({ chatData }) => (
  <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
    <Avatar className="h-10 w-10">
      <AvatarImage src={chatData.avatar} alt={chatData.name} />
      <AvatarFallback className="bg-gray-100 text-gray-600">
        {chatData.name.substring(0, 2).toUpperCase()}
      </AvatarFallback>
    </Avatar>
    <div className="flex-1 min-w-0">
      <div className="flex justify-between items-start">
        <h4 className="font-medium text-sm text-gray-900 truncate">{chatData.name}</h4>
        <span className="text-xs text-gray-500">{chatData.time}</span>
      </div>
      <p className="text-sm text-gray-600 truncate">{chatData.lastMessage}</p>
    </div>
    {chatData.unread > 0 && (
      <div className="flex-shrink-0 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
        <span className="text-xs text-white font-medium">{chatData.unread}</span>
      </div>
    )}
  </div>
);

const ListaVacia = () => (
  <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
      <MessageSquare className="h-6 w-6 text-gray-400" />
    </div>
    <h3 className="font-medium text-gray-900 mb-1">No hay chats abiertos</h3>
    <p className="text-sm text-gray-500">
      Cuando inicies una conversación, aparecerá aquí
    </p>
  </div>
);

export const ListaMensajes = () => {
  return (
    <Card className="w-full bg-white">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Mensajes</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {chatsData.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {chatsData.map((chat) => (
              <ListaChats key={chat.id} chatData={chat} />
            ))}
          </div>
        ) : (
          <ListaVacia />
        )}
      </CardContent>
    </Card>
  );
};

ListaChats.propTypes = {
    chatData: PropTypes.shape({
        id: PropTypes.number.isRequired,      
        name: PropTypes.string.isRequired,      
        lastMessage: PropTypes.string.isRequired,   
        time: PropTypes.string.isRequired,     
        unread: PropTypes.number.isRequired,
        avatar: PropTypes.string.isRequired
    }).isRequired
  };


