import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export const CreatePost = () => {
  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex space-x-4">
          <Avatar>
            <AvatarImage src="/api/placeholder/32/32" />
            <AvatarFallback>US</AvatarFallback>
          </Avatar>
          <textarea 
            className="flex-1 resize-none rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="¿Qué estás pensando?"
            rows={3}
          />
        </div>
        <div className="flex justify-end mt-4">
          <Button>Publicar</Button>
        </div>
      </CardContent>
    </Card>
  );
};