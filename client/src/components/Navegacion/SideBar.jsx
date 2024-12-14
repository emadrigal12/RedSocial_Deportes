import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export const Sidebar = ({ followers, onUnfollow }) => {
  return (
    <div className="hidden md:block w-80"> {/* Ancho del sidebar */}
      <Card className="sticky top-24 bg-white shadow-sm">
        <CardContent className="p-6">
          {/* Sección de perfil */}
          <div className="flex flex-col items-center">
            <Avatar className="h-24 w-24 ring-4 ring-gray-50">
              <AvatarImage src="/api/placeholder/240/240" alt="Profile" />
              <AvatarFallback className="bg-gray-100 text-gray-600 text-xl">
                US
              </AvatarFallback>
            </Avatar>

            {/* Información del usuario */}
            <div className="mt-4 text-center">
              <h2 className="text-xl font-semibold text-gray-900">Usuario Example</h2>
              <p className="text-sm text-gray-500 mt-1">@usuario</p>
            </div>

            {/* Seguidores dinámicos */}
            <div className="mt-6 w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Seguidores</h3>
                <span className="text-sm font-medium text-gray-600">
                  {followers.length}
                </span>
              </div>

              {followers.length > 0 ? (
                <ul className="space-y-3">
                  {followers.map((follower) => (
                    <li
                      key={follower.id}
                      className="flex justify-between items-center p-4 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 transition"
                    >
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={follower.photoURL || "/api/placeholder/48/48"}
                            alt={follower.nombre}
                          />
                          <AvatarFallback className="bg-orange-200 text-orange-700">
                            {follower.nombre?.charAt(0).toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <p className="font-medium text-gray-900">{follower.nombre}</p>
                      </div>
                      <button
                        onClick={() => onUnfollow(follower)} // Lógica para dejar de seguir
                        className="px-2 py-1 text-xs font-medium text-white bg-red-500 rounded-full hover:bg-red-600 focus:outline-none"
                      >
                        Dejar de seguir
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No tienes seguidores aún.</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
