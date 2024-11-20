import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { HomeIcon, ArrowLeftIcon } from 'lucide-react';

const Error404Animated = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-100 to-orange-50 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animación de pelotas deportivas */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className={`absolute animate-float-${i} opacity-20`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              transform: `scale(${0.5 + Math.random() * 0.5})`,
            }}
          >
            <svg className="w-12 h-12" viewBox="0 0 50 50">
              {i % 3 === 0 ? (
                // Balón de fútbol
                <circle cx="25" cy="25" r="20" fill="#333" />
              ) : i % 3 === 1 ? (
                // Balón de baloncesto
                <circle cx="25" cy="25" r="20" fill="#FF6B35" />
              ) : (
                // Pelota de tenis
                <circle cx="25" cy="25" r="20" fill="#98C93C" />
              )}
            </svg>
          </div>
        ))}
      </div>

      <div className="max-w-2xl w-full text-center space-y-8 relative z-10">
        {/* Número 404 con animación */}
        <div className="relative">
          <h1 className="text-[150px] font-black text-orange-500 leading-none">
            4
            <span className="inline-block animate-bounce">0</span>
            4
          </h1>
          <div className="absolute inset-0 bg-gradient-to-t from-orange-50 to-transparent opacity-30" />
        </div>

        {/* Contenido principal */}
        <div className="space-y-6 px-4">
          <h2 className="text-4xl font-bold text-gray-800">
            ¡Fuera de juego!
          </h2>
          
          <p className="text-xl text-gray-600 max-w-lg mx-auto">
            Parece que esta jugada no existe en nuestro campo.
            ¡Pero no te preocupes, siempre puedes volver al inicio!
          </p>

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              className="group relative overflow-hidden px-8 py-4 border-2 border-orange-500 text-orange-500 hover:text-white transition-colors duration-300"
            >
              <span className="relative z-10 flex items-center gap-2">
                <ArrowLeftIcon className="w-5 h-5" />
                Volver atrás
              </span>
              <div className="absolute inset-0 bg-orange-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
            </Button>

            <Button
              onClick={() => navigate('/home')}
              className="group relative overflow-hidden px-8 py-4 bg-orange-500 text-white hover:bg-orange-600 transition-colors duration-300"
            >
              <span className="relative z-10 flex items-center gap-2">
                <HomeIcon className="w-5 h-5" />
                Ir al inicio
              </span>
              <div className="absolute inset-0 bg-orange-600 transform translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
            </Button>
          </div>
        </div>

        {/* Mensaje de ayuda */}
        <p className="text-sm text-gray-500 mt-12">
          ¿Necesitas ayuda? {' '}
          <a href="/contacto" className="text-orange-500 hover:underline">
            Contacta con nuestro equipo
          </a>
        </p>
      </div>

      {/* Estilos para la animación de las pelotas */}
      <style jsx>{`
        @keyframes float-0 { 0%, 100% { transform: translate(0, 0) rotate(0deg); } 50% { transform: translate(100px, -100px) rotate(180deg); } }
        @keyframes float-1 { 0%, 100% { transform: translate(0, 0) rotate(0deg); } 50% { transform: translate(-150px, -80px) rotate(-180deg); } }
        @keyframes float-2 { 0%, 100% { transform: translate(0, 0) rotate(0deg); } 50% { transform: translate(80px, 120px) rotate(180deg); } }
        .animate-float-0 { animation: float-0 15s infinite; }
        .animate-float-1 { animation: float-1 18s infinite; }
        .animate-float-2 { animation: float-2 20s infinite; }
      `}</style>
    </div>
  );
};

export default Error404Animated;