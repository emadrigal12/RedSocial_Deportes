import { 
    sendPasswordResetEmail, 
    fetchSignInMethodsForEmail 
  } from 'firebase/auth';
  import { 
    collection, 
    query, 
    where, 
    getDocs 
  } from 'firebase/firestore';
  import { auth, db } from '../../lib/firebase/config';
  
  export const sendPasswordReset = async (email) => {
    try {
      // Verificar si el usuario está registrado con correo/contraseña
      console.log(auth, email);
      
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);
      
      if (signInMethods.includes('password')) {
        // Verificar en Firestore
        const usersRef = collection(db, 'Usuarios');
        const q = query(
          usersRef, 
          where('email', '==', email),
          where('authProvider', '!=', 'google')
        );
        
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
          throw new Error('Usuario no encontrado o registrado con Google');
        }
        
        // Enviar correo de restablecimiento
        await sendPasswordResetEmail(auth, email, {
          url: `${import.meta.env.VITE_APP_URL}/login`,
          handleCodeInApp: false
        });
        
        return {
          success: true,
          message: 'Correo de restablecimiento enviado'
        };
      } else {
        throw new Error('Usuario registrado con método diferente o inexistente');
      }
    } catch (error) {
      console.error('Error en restablecimiento de contraseña:', error);
      
      const errorMessages = {
        'Usuario no encontrado o registrado con Google': 
          'No se encontró un usuario válido para restablecer contraseña',
        'Usuario registrado con método diferente': 
          'Este usuario no puede restablecer contraseña',
        'auth/user-not-found': 'No se encontró un usuario con este correo',
        'auth/invalid-email': 'Correo electrónico inválido',
        'auth/too-many-requests': 'Demasiados intentos. Por favor intenta más tarde'
      };
      
      return {
        success: false,
        message: error.message || 'Ocurrió un error. Intenta nuevamente'
      };
    }
  };