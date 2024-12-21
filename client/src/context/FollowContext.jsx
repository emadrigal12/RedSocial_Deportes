import React, { createContext, useContext, useEffect, useState } from 'react';
import { collection, doc, onSnapshot, updateDoc, arrayRemove, arrayUnion } from 'firebase/firestore';
import { db } from '../lib/firebase/config';
import { useAuth } from './AuthContext';

// Crear el contexto
const FollowContext = createContext();

export const FollowProvider = ({ children }) => {
  const { user } = useAuth(); // Obtener el usuario autenticado
  const [following, setFollowing] = useState([]); // Lista de seguidos
  const [followers, setFollowers] = useState([]); // Lista de seguidores

  // Escuchar cambios en "seguidos" del usuario
  useEffect(() => {
    if (user?.uid) {
      const userDocRef = doc(db, 'Usuarios', user.uid);
      const unsubscribe = onSnapshot(userDocRef, (doc) => {
        setFollowing(doc.data()?.seguidos || []);
        setFollowers(doc.data()?.seguidores || []);
      });

      return () => unsubscribe();
    }
  }, [user]);

  // Función para seguir a un usuario
  const followUser = async (userToFollowId) => {
    try {
      const userDocRef = doc(db, 'Usuarios', user.uid);
      await updateDoc(userDocRef, {
        seguidos: arrayUnion(userToFollowId), // Agregar el usuario a la lista de seguidos
      });
    } catch (error) {
      console.error('Error al seguir al usuario:', error);
    }
  };

  // Función para dejar de seguir a un usuario
  const unfollowUser = async (userToUnfollowId) => {
    try {
      const userDocRef = doc(db, 'Usuarios', user.uid);
      await updateDoc(userDocRef, {
        seguidos: arrayRemove(userToUnfollowId), // Eliminar el usuario de la lista de seguidos
      });
    } catch (error) {
      console.error('Error al dejar de seguir al usuario:', error);
    }
  };

  return (
    <FollowContext.Provider value={{ following, followers, followUser, unfollowUser }}>
      {children}
    </FollowContext.Provider>
  );
};

// Hook para usar el contexto
export const useFollow = () => {
  return useContext(FollowContext);
};
