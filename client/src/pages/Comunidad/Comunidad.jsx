// pages/Comunidades/Comunidades.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Plus, Users } from 'lucide-react';
import ComunidadCard from '../../components/Comunidad/ComunidadCard';
import { Navbar } from '../../components/Navegacion/Navbar';

const Comunidad = () => {
  const navigate = useNavigate();
  const [comunidades, setComunidades] = useState([]);
  const [comunidadesDescubrir, setComunidadesDescubrir] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Datos de ejemplo - Reemplazar con datos reales de Firebase
  const comunidadesEjemplo = [
    {
      id: 1,
      nombre: 'Mejengas Santa Ana',
      descripcion: 'Grupo para organizar partidos de fútbol en Santa Ana',
      imagen: '/img/mejenga.jpeg',
      miembros: 234,
      eventos: 12,
      categoria: 'Fútbol'
    },
    {
      id: 2,
      nombre: 'Tenis Club Moravia',
      descripcion: 'Comunidad de tenistas en Moravia',
      imagen: '/img/tennisclub.jpg',
      miembros: 156,
      eventos: 8,
      categoria: 'Tenis'
    },
    // Más comunidades...
  ];

  const comunidadesDescubrirEjemplo = [
    {
      id: 1,
      nombre: 'Partidos FUT 7 en ulacit',
      descripcion: 'Grupo para organizar partidos de fútbol 7 en Ulacit',
      imagen: '/img/fut7.jpg',
      miembros: 234,
      eventos: 12,
      categoria: 'Fútbol'
    },
    {
      id: 2,
      nombre: 'Tenis Club Moravia',
      descripcion: 'Comunidad de tenistas en Moravia',
      imagen: '/img/baloncesto.jpg',
      miembros: 156,
      eventos: 8,
      categoria: 'Baloncesto'
    },
    // Más comunidades...
  ];

  useEffect(() => {
    // Aquí iría la lógica para obtener las comunidades de Firebase
    setComunidades(comunidadesEjemplo);
    setComunidadesDescubrir(comunidadesDescubrirEjemplo);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar className="shadow-sm" />
      <div className="w-full pt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4 sm:mb-0">
            Comunidades Deportivas
            </h1>
            <Button 
            onClick={() => navigate('/crear-comunidad')}
            className="bg-orange-500 hover:bg-orange-600 text-white"
            >
            <Plus className="w-4 h-4 mr-2" />
            Crear Comunidad
            </Button>
        </div>

        <div className="relative mb-8">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
            type="text"
            placeholder="Buscar comunidades..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full"
            />
        </div>

        <Tabs defaultValue="mis-comunidades" className="mb-8">
            <TabsList>
            <TabsTrigger variant="ghost" value="mis-comunidades">Mis Comunidades</TabsTrigger>
            <TabsTrigger value="descubrir">Descubrir</TabsTrigger>
            </TabsList>

            <TabsContent value="mis-comunidades">
            {/* Grid de Comunidades */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {comunidades.map((comunidad) => (
                <ComunidadCard
                    key={comunidad.id}
                    comunidad={comunidad}
                    onComunidadClick={() => navigate(`/comunidad/${comunidad.id}`)}
                />
                ))}
            </div>
            </TabsContent>

            <TabsContent value="descubrir">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {comunidadesDescubrir.map((comunidad) => (
                    <ComunidadCard
                        key={comunidad.id}
                        comunidad={comunidad}
                        onComunidadClick={() => navigate(`/comunidad/${comunidad.id}`)}
                    />
                    ))}
                </div>
            </TabsContent>

            
        </Tabs>

        {/* Estadísticas */}
        <Card className="p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-4">
                <Users className="w-8 h-8 text-orange-500" />
                <div>
                <h3 className="text-lg font-semibold">Total Miembros</h3>
                <p className="text-2xl font-bold text-orange-500">1,234</p>
                </div>
            </div>
            </div>
        </Card>
        </div>
      </div>
        
    </div>
  );
};

export default Comunidad;