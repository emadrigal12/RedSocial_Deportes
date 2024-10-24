import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export const Sidebar = () => {
  return (
    <div className="hidden md:block w-72">
      <Card className="sticky top-24 bg-white shadow-sm">
        <CardContent className="p-6">
          {/* Profile Section */}
          <div className="flex flex-col items-center">
            <Avatar className="h-24 w-24 ring-4 ring-gray-50">
              <AvatarImage src="/api/placeholder/240/240" alt="Profile" />
              <AvatarFallback className="bg-gray-100 text-gray-600 text-xl">
                US
              </AvatarFallback>
            </Avatar>

            {/* User Info */}
            <div className="mt-4 text-center">
              <h2 className="text-xl font-semibold text-gray-900">
                Usuario Example
              </h2>
              <p className="text-sm text-gray-500 mt-1">@usuario</p>
            </div>

            {/* Stats */}
            <div className="mt-6 w-full space-y-3">
              <div 
                className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <span className="text-gray-600 text-sm">Amigos</span>
                <span className="font-semibold text-gray-900">245</span>
              </div>
              <div 
                className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <span className="text-gray-600 text-sm">Publicaciones</span>
                <span className="font-semibold text-gray-900">123</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
