import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../lib/firebase/config';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [needsRegistration, setNeedsRegistration] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      
      if (user) {
        const token = await user.getIdToken();
        localStorage.setItem('firebaseToken', token);

        try {
          const response = await fetch('http://localhost:3000/api/auth/check-user', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          const data = await response.json();
          
          if (!data.exists  ) {
            setNeedsRegistration(true);
            if (location.pathname !== '/registro') {
              setUser({ ...user, ...data.userData });
              navigate('/registro');
            }
          } else {
            setUser({ ...user, ...data.userData });
            if (needsRegistration) {
              navigate('/intereses');
            }else{
              navigate('/home');
            }
          }
        } catch (error) {
          console.error('Error checking user:', error);
        }
      } else {
        setUser(null);
        localStorage.removeItem('firebaseToken');
        if (location.pathname !== '/' && location.pathname !== '/registro') {
          navigate('/');
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate, location]);

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    return result.user;
  };

  const logout = async () => {
    localStorage.removeItem('firebaseToken');
    await signOut(auth);
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ user, loginWithGoogle, logout, loading, needsRegistration, setNeedsRegistration }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
