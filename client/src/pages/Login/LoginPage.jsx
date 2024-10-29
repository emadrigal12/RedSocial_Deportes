import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 animate-gradient-x">
      <div className="w-full max-w-md mx-auto space-y-8">
        <div className="space-y-6 select-none">
          <h1 className="text-center text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-400 tracking-tight hover:scale-105 transition-transform duration-300">
            Sportify
          </h1>
          <p className="text-center text-sm text-gray-600 animate-fade-in">
            Tu plataforma deportiva personal
          </p>
        </div>

        <Card className="bg-white shadow-lg">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold text-center">
              Iniciar Sesión
            </CardTitle>
            <p className="text-sm text-center text-gray-500">
              Ingresa a tu cuenta para continuar
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700" htmlFor="email">
                  Correo electrónico
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@ejemplo.com"
                  required
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700" htmlFor="password">
                  Contraseña
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    required
                    className="w-full pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-style: none; "
                  >
                    {showPassword ? (
                      <EyeOffIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                  />
                  <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                    Recordarme
                  </label>
                </div>
                <a href="#" className="text-sm text-orange-500 hover:text-orange-600">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
              <Button 
                type="submit" 
                className="w-full bg-orange-500 hover:bg-orange-600"
                disabled={loading}
              >
                {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
              </Button>
              <Button 
                type="button"
                className="w-full bg-white border border-gray-300 hover:bg-gray-100 text-black flex items-center justify-center space-x-2"
                disabled={loading}
              >
                <span>{loading ? "Iniciando sesión..." : "Iniciar Sesión con Google"}</span>
                <FcGoogle className="h-5 w-5" />
              </Button>
            </form>
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                ¿No tienes una cuenta?{' '}
                <a href="/registro" className="text-orange-500 hover:text-orange-600 font-medium">
                  Regístrate
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    

    
  );
};

export default LoginPage;
