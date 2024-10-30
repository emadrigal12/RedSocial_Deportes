import { useState } from 'react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../lib/firebase/config.js';
import { userService } from './user.service.jsx';
import { useNavigate } from 'react-router-dom';

const GoogleAuth = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const { user } = await signInWithPopup(auth, provider);

      // Check if user profile exists, if not, create a new one
      const userProfile = await userService.getUserProfile(user.uid);
      if (!userProfile) {
        await userService.createUserProfile(user.uid, {
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        });
      }

      navigate('/intereses');
    } catch (error) {
      console.error('Google sign-in error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleSignIn}
      className="w-full bg-white border border-gray-300 hover:bg-gray-100 text-black flex items-center justify-center space-x-2"
      disabled={loading}
    >
      <FcGoogle className="h-5 w-5" />
      <span>{loading ? 'Iniciando sesión...' : 'Iniciar Sesión con Google'}</span>
    </button>
  );
};

export default GoogleAuth;