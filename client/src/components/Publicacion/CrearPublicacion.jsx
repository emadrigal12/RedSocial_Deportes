import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export const CrearPublicacion = () => {
  return (
    <Card className="mb-6 lg:mb-8">
      <CardContent className="p-6">
        <div className="flex space-x-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src="/api/placeholder/32/32" />
            <AvatarFallback>US</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <textarea 
              className="w-full resize-none rounded-lg border p-4 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              placeholder="¿Qué estás pensando?"
              rows={3}
            />
            <div className="flex justify-end mt-4">
              <Button 
                className="hover:bg-orange-50 hover:bg-orange-600 bg-orange-500 text-white px-6 transition-colors"
              >
                Publicar
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};