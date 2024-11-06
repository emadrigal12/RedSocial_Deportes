import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// const firebaseConfig = {
//   apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
//   authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
//   projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
//   storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
//   appId: import.meta.env.VITE_FIREBASE_APP_ID
// };

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