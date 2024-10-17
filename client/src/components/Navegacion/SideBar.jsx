import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export const Sidebar = () => {
  return (
    <div className="md:col-span-1">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center">
            <Avatar className="h-20 w-20">
              <AvatarImage src="/api/placeholder/32/32" />
              <AvatarFallback>US</AvatarFallback>
            </Avatar>
            <h2 className="mt-4 font-semibold text-lg">Usuario Example</h2>
            <p className="text-sm text-gray-500">@usuario</p>
            <div className="mt-4 w-full">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Amigos</span>
                <span>245</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>Publicaciones</span>
                <span>123</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};