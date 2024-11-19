import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBOqV8RGZkn64242HSxck6JBpXrnMLdFdI",
  authDomain: "bdsportify-f3945.firebaseapp.com",
  projectId: "bdsportify-f3945",
  storageBucket: "bdsportify-f3945.firebasestorage.app",
  messagingSenderId: "700275967026",
  appId: "1:700275967026:web:a5e99ae494b0eae880282b",
  measurementId: "G-YZLB390ZPL"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;