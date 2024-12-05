// pages/Comunidades/ComunidadDetalle.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EventoCard from '@/components/EventoCard';
import { Calendar, Users, MessageSquare, Plus } from 'lucide-react';

const ComunidadDetalle = () => {
  const { id } = useParams();
  const [comunidad, setComunidad] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Aquí iría la lógica para obtener los detalles de la comunidad de Firebase
    // Ejemplo de datos:
    setComunidad({
      id,
      nombre: 'Fútbol Madrid Centro',
      descripcion: 'Grupo para organizar partidos de fútbol en el centro de Madrid',
      imagen: '/api/placeholder/800/200',
      miembros: 234,
      eventos: [
        {
          id: 1,
          nombre: 'Partido Amistoso',
          fecha: '2024-11-20',
          descripcion: 'Partido 5v5 en el centro deportivo',
          inscritos: 8,
          capacidad: 10,
        },
        // Más eventos...
      ],
      publicaciones: [
        {
          id: 1,
          usuario: 'Juan Pérez',
          titulo: '¡Gran partido ayer!',
          contenido: 'Gracias a todos por venir al partido de ayer...',
          fecha: '2024-11-18',
        },
        // Más publicaciones...
      ],
    });
    setLoading(false);
  }, [id]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header de la comunidad */}
      <Card className="mb-8 overflow-hidden">
        <div className="relative h-48">
          <img
            src={comunidad.imagen}
            alt={comunidad.nombre}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 text-white">
            <h1 className="text-3xl font-bold mb-2">{comunidad.nombre}</h1>
            <p className="text-sm opacity-90">{comunidad.descripcion}</p>
          </div>
        </div>
      </Card>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="p-4">
          <div className="flex items-center space-x-4">
            <Users className="w-6 h-6 text-orange-500" />
            <div>
              <p className="text-sm text-gray-600">Miembros</p>
              <p className="text-xl font-bold">{comunidad.miembros}</p>
            </div>
          </div>
        </Card>
        {/* Más estadísticas... */}
      </div>

      {/* Contenido principal */}
      <Tabs defaultValue="eventos">
        <TabsList className="mb-8">
          <TabsTrigger value="eventos">
            <Calendar className="w-4 h-4 mr-2" />
            Eventos
          </TabsTrigger>
          <TabsTrigger value="publicaciones">
            <MessageSquare className="w-4 h-4 mr-2" />
            Publicaciones
          </TabsTrigger>
          <TabsTrigger value="miembros">
            <Users className="w-4 h-4 mr-2" />
            Miembros
          </TabsTrigger>
        </TabsList>

        <TabsContent value="eventos">
          <div className="mb-6">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Crear Evento
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {comunidad.eventos.map((evento) => (
              <EventoCard key={evento.id} evento={evento} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="publicaciones">
          <div className="mb-6">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Nueva Publicación
            </Button>
          </div>
          
        </TabsContent>

        <TabsContent value="miembros">
          {/* Lista de miembros */}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ComunidadDetalle;