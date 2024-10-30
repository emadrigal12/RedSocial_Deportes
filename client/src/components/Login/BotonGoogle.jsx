import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FcGoogle } from 'react-icons/fc';

export const BotonGoogle = () => {
  const { loginWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const handleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error('Google sign-in error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
        type="button"
        onClick={handleLogin}
        className="w-full bg-white border border-gray-300 hover:bg-gray-100 text-black flex items-center justify-center space-x-2"
        disabled={loading}
    >
        <FcGoogle className="h-5 w-5" />
        <span>{loading ? 'Iniciando sesión...' : 'Iniciar Sesión con Google'}</span>
    </button>
  );
};