import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EventoCard from '../../components/Evento/EventoCard';
import { Calendar, Users, MessageSquare, Plus, ArrowLeft } from 'lucide-react';
import { Navbar } from '../../components/Navegacion/Navbar';

const ComunidadDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [comunidad, setComunidad] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Aquí iría la lógica para obtener los detalles de la comunidad de Firebase
    // Simulación de datos que coinciden con tu estructura
    setComunidad({
      id,
      nombre: 'Mejengas Santa Ana',
      descripcion: 'Grupo para organizar partidos de fútbol en Santa Ana',
      imagen: '/img/mejenga.jpeg',
      miembros: 234,
      eventos: [
        {
          id: 1,
          nombre: 'Mejenga Sabatina',
          fecha: '2024-11-20',
          descripcion: 'Partido amistoso en la cancha de Santa Ana',
          inscritos: 8,
          capacidad: 10,
        },
        {
          id: 2,
          nombre: 'Torneo Relámpago',
          fecha: '2024-11-22',
          descripcion: 'Torneo rápido de 4 equipos',
          inscritos: 12,
          capacidad: 16,
        }
      ],
      categoria: 'Fútbol'
    });
    setLoading(false);
  }, [id]);

  const handleCrearEvento = () => {
    navigate(`/comunidad/${id}/crear-evento`);
  };

  const handleVolverAComunidades = () => {
    navigate('/comunidades');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar className="shadow-sm" />
        <div className="container mx-auto px-4 py-8 pt-16">
          <p className="text-lg">Cargando detalles de la comunidad...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar className="shadow-sm" />
      <div className="w-full pt-16">
        <div className="container mx-auto px-4 py-8">
          {/* Botón Volver y Header */}
          <div className="flex items-center mb-6">
            <Button 
               
              onClick={handleVolverAComunidades}
              className="mr-4 bg-gradient-to-r from-orange-400 to-orange-600"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a Comunidades
            </Button>
          </div>

          {/* Header de la comunidad */}
          <Card className="mb-8">
            <div className="relative h-48">
              <img
                src={comunidad.imagen}
                alt={comunidad.nombre}
                className="w-full h-full object-cover rounded-t-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-t-lg" />
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
            <Card className="p-4">
              <div className="flex items-center space-x-4">
                <Calendar className="w-6 h-6 text-orange-500" />
                <div>
                  <p className="text-sm text-gray-600">Eventos</p>
                  <p className="text-xl font-bold">{comunidad.eventos.length}</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center space-x-4">
                <MessageSquare className="w-6 h-6 text-orange-500" />
                <div>
                  <p className="text-sm text-gray-600">Categoría</p>
                  <p className="text-xl font-bold">{comunidad.categoria}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Contenido principal */}
          <Tabs defaultValue="eventos" className="space-y-6">
            <TabsList>
              <TabsTrigger value="eventos">
                <Calendar className="w-4 h-4 mr-2" />
                Eventos
              </TabsTrigger>
              <TabsTrigger value="miembros">
                <Users className="w-4 h-4 mr-2" />
                Miembros
              </TabsTrigger>
            </TabsList>

            <TabsContent value="eventos">
              <div className="mb-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold">Eventos de la Comunidad</h2>
                <Button 
                  onClick={handleCrearEvento}
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
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

            <TabsContent value="miembros">
              <div className="mb-6">
                <h2 className="text-2xl font-bold">Miembros de la Comunidad</h2>
              </div>
              {/* Aquí iría el listado de miembros */}
              <p className="text-gray-600">Listado de miembros próximamente...</p>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ComunidadDetalle;