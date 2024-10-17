import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export const Sidebar = () => {
  return (
    <div className="hidden sm:block md:col-span-1">
      <Card className="sticky top-24">
        <CardContent className="p-6 lg:p-8">
          <div className="flex flex-col items-center">
            <Avatar className="h-24 w-24 lg:h-32 lg:w-32">
              <AvatarImage src="/api/placeholder/32/32" />
              <AvatarFallback>US</AvatarFallback>
            </Avatar>
            <h2 className="mt-6 font-semibold text-xl">Usuario Example</h2>
            <p className="text-sm text-gray-500 mt-1">@usuario</p>
            <div className="mt-6 w-full space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Amigos</span>
                <span className="font-semibold">245</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Publicaciones</span>
                <span className="font-semibold">123</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};