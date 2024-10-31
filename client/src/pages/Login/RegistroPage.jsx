import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FcGoogle } from 'react-icons/fc';
import { Button } from "@/components/ui/button";
import { EyeIcon, EyeOffIcon } from 'lucide-react';

const RegistroPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const { user, needsRegistration, logout } = useAuth();
  const navigate = useNavigate();
  
  
  const [isGoogleAuth, setIsGoogleAuth] = useState(() => {
    const storedAuthMethod = localStorage.getItem('authMethod');
    return storedAuthMethod === 'google';
  });
  
  const [formData, setFormData] = useState({
    nombre: user?.displayName?.split(' ')[0] || '',
    apellidos: user?.displayName?.split(' ').slice(1).join(' ') || '',
    usuario: '',
    telefono: '',
    fechaNacimiento: '',
    email: user?.email || '',
    password: ''
  });

  useEffect(() => {
    if (user) {
      const isGoogle = user.providerData?.[0]?.providerId === 'google.com';
      
      console.log(user.providerData?.[0]?.providerId);
      
      setIsGoogleAuth(isGoogle);
      localStorage.setItem('authMethod', isGoogle ? 'google' : 'email');
      setInitialLoading(false);
    } else {
      setInitialLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user && !needsRegistration) {
      navigate('/home');
    }
  }, [user, needsRegistration, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = localStorage.getItem('firebaseToken');
      
      
      
      const response = await fetch('http://localhost:3000/api/auth/complete-registro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData
        })
      });

      if (response.ok) {
        navigate('/intereses');
      } else {
        throw new Error('Registration failed');
      }
    } catch (error) {
      console.error('Error completing registration:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleIniciarSesion = async () => {
    try {
      localStorage.removeItem('authMethod');
      await logout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  
  if (initialLoading) {
    return null; 
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 animate-gradient-x">
      <div className="w-full max-w-2xl mx-auto space-y-8">
        <div className="space-y-6 select-none">
          <h1 className="text-center text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-400 tracking-tight hover:scale-105 transition-transform duration-300">
            Sportify
          </h1>
          <p className="text-center text-sm text-gray-600 animate-fade-in">
            Únete a nuestra comunidad deportiva
          </p>
        </div>

        <Card className="bg-white shadow-lg">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold text-center">
              Crear Cuenta
            </CardTitle>
            <p className="text-sm text-center text-gray-500">
              Completa tus datos para comenzar
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700" htmlFor="firstName">
                    Nombre
                  </label>
                  <Input
                    id="firstName"
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                    placeholder="Juan"
                    required
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700" htmlFor="lastName">
                    Apellidos
                  </label>
                  <Input
                    id="lastName"
                    type="text"
                    value={formData.apellidos}
                    onChange={(e) => setFormData(prev => ({ ...prev, apellidos: e.target.value }))}
                    placeholder="Pérez"
                    required
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700" htmlFor="username">
                    Nombre de usuario
                  </label>
                  <Input
                    id="username"
                    type="text"
                    value={formData.usuario}
                    onChange={(e) => setFormData(prev => ({ ...prev, usuario: e.target.value }))}
                    placeholder="juanperez123"
                    required
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700" htmlFor="phone">
                    Teléfono
                  </label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.telefono}
                    onChange={(e) => setFormData(prev => ({ ...prev, telefono: e.target.value }))}
                    required
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700" htmlFor="fechaNacimiento">
                    Fecha de nacimiento
                  </label>
                  <Input
                    id="fechaNacimiento"
                    type="date"
                    required
                    onChange={(e) => setFormData(prev => ({ ...prev, fechaNacimiento: e.target.value }))}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700" htmlFor="email">
                    Correo electrónico
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="juan@ejemplo.com"
                    required
                    value={user?.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    disabled={user?.email?.length > 0}
                    className="w-full"
                  />
                </div>
                {!isGoogleAuth && (
                  <>
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
                          onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                          className="w-full pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none"
                        >
                          {showPassword ? (
                            <EyeOffIcon className="h-5 w-5" />
                          ) : (
                            <EyeIcon className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700" htmlFor="confirmPassword">
                        Confirmar contraseña
                      </label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          required
                          onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                          className="w-full pr-10"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="flex items-center">
                <input
                  id="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                />
                <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                  Acepto los <a href="#" className="text-orange-500 hover:text-orange-600">términos y condiciones</a>
                </label>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-orange-500 hover:bg-orange-600"
                disabled={loading}
              >
                {loading ? "Creando cuenta..." : "Crear cuenta"}
              </Button>
              
              
              {!user && !isGoogleAuth && (
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full"></span>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">O continúa con</span>
                  </div>
                  <Button 
                    type="button"
                    className="w-full bg-white border border-gray-300 hover:bg-gray-150 text-black flex items-center justify-center space-x-2 mt-3"
                    disabled={loading}
                  >
                    <FcGoogle className="h-5 w-5" />
                    <span>{loading ? "Registrando..." : "Registrarse con Google"}</span>
                  </Button>
                </div>
              )}
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                ¿Ya tienes una cuenta?{' '}
                <a onClick={handleIniciarSesion} className="text-orange-500 hover:text-orange-600 font-medium">
                  Inicia sesión
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegistroPage;