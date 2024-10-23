import { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ImagePlus} from 'lucide-react';

export const CrearPublicacion = () => {
  const [contenido, setContenido] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!contenido.trim()) return;

    setIsLoading(true);
    try {
      
      setContenido('');
    } catch (error) {
      console.error('Error al publicar:', error);
    }
    setIsLoading(false);
  };

  return (
    <Card className="mb-6 hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit}>
          <div className="flex space-x-4">
            <Avatar className="h-12 w-12 ring-2 ring-orange-100 transition-all duration-200 hover:ring-orange-300">
              <AvatarImage src="/api/placeholder/32/32" />
              <AvatarFallback>US</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-4">
              <textarea 
                value={contenido}
                onChange={(e) => setContenido(e.target.value)}
                className="w-full resize-none rounded-lg border p-4 text-base focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50 hover:bg-gray-100 transition-colors"
                placeholder="¿Qué está pasando en el mundo deportivo?"
                rows={3}
              />
              <div className="flex justify-between items-center">
                <Button
                  type="button"
                  variant="ghost"
                  className="bg-white text-orange-500 border border-orange-500 hover:bg-orange-500 hover:text-white transition-all duration-300"
                >
                  <ImagePlus className="h-5 w-5" />
                </Button>
                <Button 
                  type="submit"
                  disabled={isLoading || !contenido.trim()}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 transition-colors disabled:opacity-50"
                >
                  Publicar
                </Button>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

CrearPublicacion.propTypes = {
  onPublicar: PropTypes.func.isRequired,
};