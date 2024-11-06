import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import BotonGoogle from '../../components/Login/BotonGoogle';
import { useAuth } from '../../context/AuthContext';

  const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const navigate = useNavigate();
  const { loginWithEmail } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { user, isNewUser, needsInterests } = await loginWithEmail(
        formData.email,
        formData.password
      );

      if (isNewUser) {
        navigate('/registro');
      } else if (needsInterests) {
        navigate('/intereses');
      } else {
        navigate('/home');
      }
    } catch (error) {
      console.error('Error de inicio de sesión:', error);
    } finally {
      setLoading(false);
    }
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
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@ejemplo.com"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent"
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
                  <a href="/recuperar-contrasena" className="text-sm text-orange-500 hover:text-orange-600">
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
                <BotonGoogle />
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
