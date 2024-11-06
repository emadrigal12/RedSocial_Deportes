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

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [needsRegistration, setNeedsRegistration] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'Usuarios', user.uid));
        if (!userDoc.exists()) {
          setNeedsRegistration(true);
        }
        setUser(user);
      } else {
        setUser(null);
        setNeedsRegistration(false);
      }
      setLoading(false);
      console.log(user);
      
    });

    return unsubscribe;
  }, []);

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Check if user exists in Usuarios collection
      const userDoc = await getDoc(doc(db, 'Usuarios', result.user.uid));
      
      if (!userDoc.exists()) {
        // Create basic user document
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

      // Check if user has completed interests
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
      
      // Check if user exists in Usuarios collection
      const userDoc = await getDoc(doc(db, 'Usuarios', result.user.uid));
      
      if (!userDoc.exists()) {
        throw new Error('Usuario no encontrado');
      }

      // Check if user has completed interests
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
      
      // Create user document
      await setDoc(doc(db, 'Usuarios', result.user.uid), {
        ...userData,
        email,
        authProvider: 'email',
        createdAt: new Date().toISOString()
      });

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
      
      // Update user document
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

  const value = {
    user,
    loading,
    needsRegistration,
    loginWithGoogle,
    loginWithEmail,
    registerWithEmail,
    completeRegistration,
    saveUserInterests,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};