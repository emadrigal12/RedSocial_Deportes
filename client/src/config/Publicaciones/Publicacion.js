import { is } from "date-fns/locale";
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
    arrayRemove,
    getDoc,
    deleteDoc ,
    increment ,
    FieldValue
  } from 'firebase/firestore';


const postsCollection = collection(db, 'Publicaciones');

export const createPost = async (user, postData) => {
  try {
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

export const fetchComments = async (postId, setComments) => {
  try {
    const commentsRef = collection(postsCollection, postId, 'comments');
    const commentsQuery = query(commentsRef, orderBy('createdAt', 'asc'));
    const commentsSnapshot = await getDocs(commentsQuery);

    const comments = commentsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setComments(comments);

    return () => {
    };
  } catch (error) {
    throw error;
  }
};

export const addComment = async (user ,postId, commentContent) => {
  try {
    
    await addDoc(collection(postsCollection, postId, 'comments'), {
      content: commentContent,
      createdAt: new Date(),
      userId: user.uid,
      userName: user.displayName,
      userAvatar: user.photoURL,
    });
    await updateDoc(doc(postsCollection, postId), {
      comments: FieldValue.increment(1),
    });
  } catch (error) {
    throw error;
  }
};

export const addLike = async (postId, isLike) => {
  try {
    await updateDoc(doc(postsCollection, postId), {
      likes: isLike ? await incrementLikes(1) : await incrementLikes(-1),
    });
  } catch (error) {
    throw error;
  }
};

export const sharePost = async (user, post) => {
  try {
    console.log("Documento a crear (antes de asignar ID):", post);

    const docRef = await addDoc(postsCollection, {
      ...post,
      userId: user.uid,
      userName: user.displayName,
      userAvatar: user.photoURL,
      createdAt: new Date(),
    });
    
    const newId = docRef.id;
    console.log("ID del documento creado:", newId);

    await updateDoc(doc(postsCollection, newId), {
      id: newId, 
    });

    console.log("Documento actualizado con el nuevo ID:", newId);
    return newId; 
  } catch (error) {
    console.error("Error al compartir el post:", error);
    throw error;
  }
};

export const deletePost = async (postId) => {
  try {
    await deleteDoc(doc(postsCollection, postId));
  } catch (error) {
    throw error;
  }
};

export const updatePost = async (postId, content) => {
  try {
    await updateDoc(doc(postsCollection, postId), {
      content,
    });
  } catch (error) {
    throw error;
  }
};

const incrementLikes = async (docId) => {
    const docRef = doc(db, "Publicaciones", docId);
    try {
        await updateDoc(docRef, {
            likes: isLike ? FieldValue.increment(1) : FieldValue.increment(-1),
        });
        console.log("Campo incrementado exitosamente");
    } catch (error) {
        console.error("Error al incrementar el campo:", error);
    }
};

const incrementLComments = async (incrementBy) => {
  try {
    return FieldValue.increment(incrementBy);
  } catch (error) {
    console.error("Error al incrementar los comentarios:", error);
    throw error;
  }
};



