import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword,
    signOut,
    updateProfile
  } from 'firebase/auth';
  import { auth } from '../lib/firebase/config';
  
  export const authService = {
    async login(email, password) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
      } catch (error) {
        throw error;
      }
    },
  
    async register(email, password, displayName) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName });
        return userCredential.user;
      } catch (error) {
        throw error;
      }
    },
  
    async logout() {
      try {
        await signOut(auth);
      } catch (error) {
        throw error;
      }
    }
  };