import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { auth, db } from '../../lib/firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = () => {
  const [userData, setUserData] = useState(null);
  const [postCount, setPostCount] = useState(0);
  const {user} = useAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const userDocRef = doc(db, 'Usuarios', currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);

          const postsQuery = query(
            collection(db, 'Publicaciones'), 
            where('userId', '==', currentUser.uid)
          );
          const postQuerySnapshot = await getDocs(postsQuery);

          if (userDocSnap.exists()) {
            setUserData({
              ...userDocSnap.data(),
              email: currentUser.email,
              displayName: userDocSnap.data().nombreUsuario || currentUser.displayName
            });
            setPostCount(postQuerySnapshot.size);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  if (!userData) {
    return (
      <div className="hidden md:block w-72">
        <Card className="sticky top-24 bg-white shadow-sm">
          <CardContent className="p-6 text-center">
            Cargando...
          </CardContent>
        </Card>
      </div>
    );
  }

  const avatarFallback = userData.displayName 
    ? userData.displayName.substring(0, 2).toUpperCase() 
    : 'US';

  return (
    <div className="hidden md:block w-72">
      <Card className="sticky top-24 bg-white shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col items-center">
            <Avatar className="h-24 w-24 ring-4 ring-gray-50">
              <AvatarImage 
                src={user.photoURL || "/api/placeholder/240/240"} 
                alt="Profile" 
              />
              <AvatarFallback className="bg-gray-100 text-gray-600 text-xl">
                {avatarFallback}
              </AvatarFallback>
            </Avatar>

            <div className="mt-4 text-center">
              <h2 className="text-xl font-semibold text-gray-900">
                {userData.displayName || 'Usuario'}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                @{userData.usuario || 'usuario'}
              </p>
            </div>

            <div className="mt-6 w-full space-y-3">
              <div 
                className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <span className="text-gray-600 text-sm">Amigos</span>
                <span className="font-semibold text-gray-900">
                  {userData.amigos?.length || 0}
                </span>
              </div>
              <div 
                className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <span className="text-gray-600 text-sm">Publicaciones</span>
                <span className="font-semibold text-gray-900">
                  {postCount}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};