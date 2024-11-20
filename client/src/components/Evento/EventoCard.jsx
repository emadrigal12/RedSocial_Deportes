import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const EventoCard = ({ evento }) => {
    const navigate = useNavigate();
  return (
    <Card>
      <CardHeader>
        <CardTitle>{evento.nombre}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{evento.fecha}</p>
        <p className="mt-2">{evento.descripcion}</p>
        <p className="mt-2">Inscritos: {evento.inscritos}/{evento.capacidad}</p>
      </CardContent>
      <CardFooter>
        <Button className={'bg-gradient-to-r from-orange-400 to-orange-600'}  onClick={()=> navigate(`/evento/${evento.id}`)}>
          Ver Evento
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EventoCard;