import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, Clock, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const noticias = [
    {
      id: 1,
      titulo: "La Selección de Costa Rica se prepara para el próximo mundial",
      descripcion: "El equipo nacional intensifica sus entrenamientos de cara a las eliminatorias...",
      imagen: "/img/sele-costarica.jpeg",
      categoria: "Fútbol",
      fecha: "22 Oct 2024"
    },
    {
      id: 2,
      titulo: "NBA: Lakers vs Warriors rompe récord de audiencia",
      descripcion: "El enfrentamiento entre los históricos rivales marca nuevo hito en la temporada regular...",
      imagen: "/img/lakers-vs-warriors.jpg",
      categoria: "Baloncesto",
      fecha: "22 Oct 2024"
    },
    {
      id: 3,
      titulo: "Alcaraz triunfa en el Masters 1000 de Miami",
      descripcion: "El tenista español continúa su dominio en la temporada con otra victoria convincente...",
      imagen: "/img/alcaraz.jpg",
      categoria: "Tenis",
      fecha: "22 Oct 2024"
    },
    {
      id: 4,
      titulo: "Manchester City mantiene el liderato en la Premier League",
      descripcion: "El equipo de Guardiola sigue firme en la cima de la tabla tras victoria clave...",
      imagen: "/img/man-city.jpg",
      categoria: "Fútbol",
      fecha: "22 Oct 2024"
    },
    
  ];

export const Noticias = () => {
    
    const [mostrarTodas, setMostrarTodas] = useState(false);
    const [ setHoveredId] = useState(null);
    const noticiasAMostrar = mostrarTodas ? noticias : noticias.slice(0, 4);

    const categoryColors = {
        'Fútbol': 'bg-emerald-50 text-emerald-600',
        'Baloncesto': 'bg-blue-50 text-blue-600',
        'Tenis': 'bg-purple-50 text-purple-600'
    };

    return (
        <section className="w-full bg-white rounded-xl shadow-sm mb-6 overflow-hidden">
            <div className="border-b border-gray-100">
                <div className="max-w-[1920px] mx-auto px-4 lg:px-6 py-4">
                    <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-orange-500" />
                            <h2 className="text-xl font-semibold text-gray-800">Últimas Noticias</h2>
                        </div>
                        <Button
                            className="bg-white text-orange-500 border border-orange-500 hover:bg-orange-500 hover:text-white transition-all duration-300"
                            onClick={() => setMostrarTodas(!mostrarTodas)}
                        >
                            {mostrarTodas ? 'Ver menos' : 'Ver más'}
                            <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            <div className="max-w-[1920px] mx-auto px-4 lg:px-6 py-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    <AnimatePresence>
                        {noticiasAMostrar.map((noticia) => (
                            <motion.div
                                key={noticia.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Card 
                                    className="group h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                                    // onMouseEnter={() => setHoveredId(noticia.id)}
                                    // onMouseLeave={() => setHoveredId(null)}
                                >
                                    <div className="relative aspect-video overflow-hidden rounded-t-lg">
                                        <img
                                            src={noticia.imagen}
                                            alt={noticia.titulo}
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </div>

                                    <CardContent className="p-5">
                                        <div className="flex justify-between items-center mb-3">
                                            <span className={`text-xs font-medium px-3 py-1 rounded-full ${categoryColors[noticia.categoria] || 'bg-gray-50 text-gray-600'}`}>
                                                {noticia.categoria}
                                            </span>
                                            <div className="flex items-center text-gray-400">
                                                <Clock className="h-3 w-3 mr-1" />
                                                <span className="text-xs">{noticia.fecha}</span>
                                            </div>
                                        </div>

                                        <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 min-h-[48px] group-hover:text-orange-500 transition-colors">
                                            {noticia.titulo}
                                        </h3>
                                        <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                                            {noticia.descripcion}
                                        </p>

                                        <Button
                                            className="w-full bg-white text-orange-500 border border-orange-500 hover:bg-orange-500 hover:text-white transition-all duration-300"
                                        >
                                            Leer más
                                        </Button>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
};

