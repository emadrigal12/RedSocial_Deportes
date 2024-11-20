// src/components/Login/BotonGoogle.js
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const BotonGoogle = () => {
  const [loading, setLoading] = useState(false);
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const { user, isNewUser, needsInterests } = await loginWithGoogle();
      
      if (isNewUser) {
        navigate('/registro');
      } else if (needsInterests) {
        navigate('/intereses');
      } else {
        navigate('/home');
      }
    } catch (error) {
      console.error('Error during Google login:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      type="button"
      onClick={handleGoogleLogin}
      className="w-full bg-white border border-gray-300 hover:bg-gray-100 text-black flex items-center justify-center space-x-2"
      disabled={loading}
    >
      <FcGoogle className="h-5 w-5" />
      <span>{loading ? "Iniciando sesión..." : "Continuar con Google"}</span>
    </Button>
  );
};

export default BotonGoogle;