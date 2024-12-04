import { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { db, collection, addDoc } from './firebase';
import { onInsert } from '../../config/Login/login';
import Swal from "sweetalert2";

const RegistroPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const navigate = useNavigate();
  const { user, completeRegistration, needsRegistration, newUser } = useAuth();

  const [formData, setFormData] = useState({
    nombre: user?.displayName?.split(' ')[0] || '',
    apellidos: user?.displayName?.split(' ').slice(1).join(' ') || '',
    usuario: '',
    telefono: '',
    fechaNacimiento: '',
    email:  '', 
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (!user && !newUser) {
      navigate('/login');
      return;
    }

    if (!needsRegistration) {
      navigate('/home');
      return;
    }

    const isGoogleUser = user?.providerData?.[0]?.providerId === 'google.com';
    
    if (isGoogleUser) {
      setFormData(prev => ({
        ...prev,
        email: user.email,
        nombre: user.displayName?.split(' ')[0] || '',
        apellidos: user.displayName?.split(' ').slice(1).join(' ') || '',
      }));
    }

    setInitialLoading(false);
  }, [user, needsRegistration, navigate]);

  const validateForm = () => {
    if (!formData.usuario || !formData.fechaNacimiento) {
      return false;
    }

    if (!isGoogleUser) {
      if (formData.password !== formData.confirmPassword || formData.password.length < 6) {
        return false;
      }
    }

    return true;
  };

  const generateRandomId = () => {
    return Math.random().toString(36).substring(2, 15);
  };

  const onInsert = async (documento) => {
    try {
      const id = generateRandomId(); 
      await addDoc(collection(db, 'usuarios'), {
        ...documento,
        id: id, 
      });

      console.log('Documento insertado con éxito');
    } catch (error) {
      console.error('Error al insertar el documento:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const userData = {
        nombre: formData.nombre,
        apellidos: formData.apellidos,
        usuario: formData.usuario,
        telefono: formData.telefono,
        fechaNacimiento: formData.fechaNacimiento,
        email: formData.email,
      };


      await onInsert(userData);


      navigate('/intereses');
    } catch (error) {
      console.error('Error al completar el registro:', error);
      Swal.fire({
        title: "Error",
        text: "Registro No Ingresado Correctamente",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <div>Cargando...</div>;
  }

  const isGoogleUser = user?.providerData?.[0]?.providerId === 'google.com';

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 animate-gradient-x">
      <div className="w-full max-w-2xl mx-auto space-y-8">
        <div className="space-y-6 select-none">
          <h1 className="text-center text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-400 tracking-tight hover:scale-105 transition-transform duration-300">
            Sportify
          </h1>
          <p className="text-center text-sm text-gray-600 animate-fade-in">
            {isGoogleUser ? 'Completa tu perfil' : 'Únete a nuestra comunidad deportiva'}
          </p>
        </div>

        <Card className="bg-white shadow-lg">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold text-center">
              {isGoogleUser ? 'Completa tu registro' : 'Crear cuenta'}
            </CardTitle>
            <p className="text-sm text-center text-gray-500">
              {isGoogleUser 
                ? 'Solo necesitamos algunos datos adicionales' 
                : 'Completa tus datos para comenzar'}
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700" htmlFor="nombre">
                    Nombre
                  </label>
                  <Input
                    id="nombre"
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                    disabled={isGoogleUser}
                    required
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700" htmlFor="apellidos">
                    Apellidos
                  </label>
                  <Input
                    id="apellidos"
                    type="text"
                    value={formData.apellidos}
                    onChange={(e) => setFormData(prev => ({ ...prev, apellidos: e.target.value }))}
                    disabled={isGoogleUser}
                    required
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700" htmlFor="usuario">
                    Nombre de usuario
                  </label>
                  <Input
                    id="usuario"
                    type="text"
                    value={formData.usuario}
                    onChange={(e) => setFormData(prev => ({ ...prev, usuario: e.target.value }))}
                    required
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700" htmlFor="telefono">
                    Teléfono
                  </label>
                  <Input
                    id="telefono"
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
                    value={formData.fechaNacimiento}
                    onChange={(e) => setFormData(prev => ({ ...prev, fechaNacimiento: e.target.value }))}
                    required
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
                    value={formData.email}
                    disabled
                    className="w-full"
                  />
                </div>

                {!isGoogleUser && (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700" htmlFor="password">
                        Contraseña
                      </label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                          required
                          className="w-full pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                        >
                          {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700" htmlFor="confirmPassword">
                        Confirmar contraseña
                      </label>
                      <Input
                        id="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        required
                        className="w-full"
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="flex justify-center">
                <Button type="submit" className="w-full sm:w-auto" disabled={loading}>
                  {loading ? 'Cargando...' : 'Registrar'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegistroPage;
