import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

const CrearEvento = () => {
  const [nombre, setNombre] = useState('');
  const [fecha, setFecha] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [capacidad, setCapacidad] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica para crear el evento
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Crear Evento</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              label="Nombre del Evento"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
            <Input
              label="Fecha"
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            />
            <Textarea
              label="Descripción"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
            <Input
              label="Capacidad"
              type="number"
              value={capacidad}
              onChange={(e) => setCapacidad(e.target.value)}
            />
          </div>
          <Button type="submit" variant="primary" className="mt-4">
            Crear Evento
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CrearEvento;