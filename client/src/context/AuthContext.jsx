import { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc,
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { auth, db } from '../lib/firebase/config';
import { useNavigate, useLocation  } from 'react-router-dom';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [needsRegistration, setNeedsRegistration] = useState(false);
  const [newUser, setnewUser] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      const pathSegments = location.pathname.split('/').filter(Boolean);
      const lastSegment = pathSegments[pathSegments.length - 1];
      console.log(pathSegments, lastSegment);
      
      if (user && lastSegment !== 'registro') {
        // Verificar si el usuario existe en la colección 'Usuarios'
        const userDoc = await getDoc(doc(db, 'Usuarios', user.uid));
        if (!userDoc.exists()) {
          setNeedsRegistration(true); // Usuario necesita registro
        }
        setUser(user); 
      } else if (!user && (lastSegment !== 'registro' || lastSegment !== 'recuperar') ) {
        // Si no hay usuario y la ruta no es 'registro', redirigir al login
        navigate('/');
      } else {
        // Rutas públicas (como 'registro') no requieren redirección
        setUser(null);
        setNeedsRegistration(true);
        setnewUser(true)
      }
      setLoading(false);
      
      console.log(lastSegment, 'recuperar-contrasena');
      
    });

    return unsubscribe;
  }, []);

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      const userDoc = await getDoc(doc(db, 'Usuarios', result.user.uid));
      
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'Usuarios', result.user.uid), {
          email: result.user.email,
          nombre: result.user.displayName?.split(' ')[0] || '',
          apellidos: result.user.displayName?.split(' ').slice(1).join(' ') || '',
          authProvider: 'google',
          createdAt: new Date().toISOString()
        });
        setNeedsRegistration(true);
        return { user: result.user, isNewUser: true };
      }

      const interesesDoc = await getDoc(doc(db, 'Intereses', result.user.uid));
      if (!interesesDoc.exists()) {
        return { user: result.user, needsInterests: true };
      }

      return { user: result.user, isNewUser: false };
    } catch (error) {
      console.error('Error en login con Google:', error);
      throw error;
    }
  };

  const loginWithEmail = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      
      const userDoc = await getDoc(doc(db, 'Usuarios', result.user.uid));
      
      if (!userDoc.exists()) {
        throw new Error('Usuario no encontrado');
      }

      const interesesDoc = await getDoc(doc(db, 'Intereses', result.user.uid));
      if (!interesesDoc.exists()) {
        return { user: result.user, needsInterests: true };
      }

      return { user: result.user, isNewUser: false };
    } catch (error) {
      console.error('Error en login con email:', error);
      throw error;
    }
  };

  const registerWithEmail = async (email, password, userData) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      await setDoc(doc(db, 'Usuarios', result.user.uid), {
        ...userData,
        email,
        authProvider: 'email',
        createdAt: new Date().toISOString()
      });
      await loginWithEmail(email, password)
      setNeedsRegistration(false);
      return { user: result.user, isNewUser: true };
    } catch (error) {
      console.error('Error en registro con email:', error);
      throw error;
    }
  };

  const completeRegistration = async (userData) => {
    try {
      if (!user) throw new Error('No hay usuario autenticado');
      
      await setDoc(doc(db, 'Usuarios', user.uid), {
        ...userData,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      setNeedsRegistration(false);
      return true;
    } catch (error) {
      console.error('Error completando registro:', error);
      throw error;
    }
  };

  const saveUserInterests = async (interests) => {
    try {
      if (!user) throw new Error('No hay usuario autenticado');
      
      console.log(interests, 'Intereses');
      
      await setDoc(doc(db, 'Intereses', user.uid), {
        intereses: interests,
        updatedAt: new Date().toISOString()
      });

      return true;
    } catch (error) {
      console.error('Error guardando intereses:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setNeedsRegistration(false);
      localStorage.removeItem('user'); 
      
      return true;
    } catch (error) {
      console.error('Error en logout:', error);
     
      if (error.code === 'ERR_BLOCKED_BY_CLIENT') {
        setUser(null);
        setNeedsRegistration(false);
        localStorage.removeItem('user');
        return true;
      }
      throw error;
    }
  };

  const updateUserProfile = async (userData) => {
    try {
      if (!user) throw new Error('No hay usuario autenticado');

      await setDoc(doc(db, 'Usuarios', user.uid), {
        ...userData,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      return true;
    } catch (error) {
      console.error('Error actualizando el perfil:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    needsRegistration,
    newUser,
    loginWithGoogle,
    loginWithEmail,
    registerWithEmail,
    completeRegistration,
    saveUserInterests,
    logout,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 