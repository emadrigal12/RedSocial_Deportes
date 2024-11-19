import { db } from "../../lib/firebase/config";
import { 
    getFirestore, 
    collection, 
    addDoc, 
    serverTimestamp, 
    query, 
    orderBy, 
    getDocs,
    updateDoc,
    doc,
    arrayUnion,
    arrayRemove
  } from 'firebase/firestore';
  import { getAuth } from 'firebase/auth';


const auth = getAuth();

export const createPost = async (postData) => {
  try {
    const user = auth.currentUser;
    console.log(user);
    
    if (!user) throw new Error('Usuario no autenticado');

    const postRef = await addDoc(collection(db, 'Publicaciones'), {
      userId: user.uid,
      userName: user.displayName || 'Usuario Anónimo',
      userAvatar: user.photoURL || null,
      ...postData,
      createdAt: serverTimestamp(),
      likes: 0,
      comments: 0,
      likedBy: [],
    });

    return postRef.id;
  } catch (error) {
    console.error('Error al crear la publicación:', error);
    throw error;
  }
};

export const getPosts = async () => {
  try {
    const postsQuery = query(
      collection(db, 'Publicaciones'),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(postsQuery);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error al obtener las publicaciones:', error);
    throw error;
  }
};

export const toggleLike = async (postId, userId) => {
  try {
    const postRef = doc(db, 'Publicaciones', postId);
    const postDoc = await getDoc(postRef);
    
    if (!postDoc.exists()) {
      throw new Error('Post no encontrado');
    }

    const postData = postDoc.data();
    const isLiked = postData.likedBy.includes(userId);

    await updateDoc(postRef, {
      likedBy: isLiked ? arrayRemove(userId) : arrayUnion(userId),
      likes: isLiked ? postData.likes - 1 : postData.likes + 1
    });

    return !isLiked;
  } catch (error) {
    console.error('Error al actualizar el like:', error);
    throw error;
  }
};
