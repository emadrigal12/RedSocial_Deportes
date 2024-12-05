import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const ComunidadCard = ({ comunidad }) => {
  const navigate = useNavigate();
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>{comunidad.nombre}</CardTitle>
      </CardHeader>
      <CardContent>
        <img src={comunidad.imagen} alt={comunidad.nombre} className="w-full h-40 object-cover" />
        <p className="mt-4">{comunidad.descripcion}</p>
      </CardContent>
      <CardFooter>
        <Button className={'bg-gradient-to-r from-orange-400 to-orange-600'} onClick={()=> navigate('/comunidad/${comunidad.id}')}>
          Ver Comunidad
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ComunidadCard;