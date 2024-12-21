import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  updateDoc,
  doc,
  getDocs 
} from 'firebase/firestore';
import { db } from '../../lib/firebase/config';

export const NOTIFICATION_TYPES = {
  LIKE: 'LIKE',
  COMMENT: 'COMMENT',
  SHARE: 'SHARE',
  FOLLOW: 'FOLLOW',
  FRIEND_REQUEST: 'FRIEND_REQUEST' // Tipo de notificación para solicitudes de amistad
};

// Crear notificación genérica
export const createNotification = async (data) => {
  try {
    const notificationData = {
      ...data,
      createdAt: serverTimestamp(),
      read: false
    };
    
    await addDoc(collection(db, 'Notificaciones'), notificationData);
    return { success: true };
  } catch (error) {
    console.error('Error al crear notificación:', error);
    return { success: false, error };
  }
};

// Enviar solicitud de amistad
export const sendFriendRequest = async ({ senderId, senderName, recipientId }) => {
  try {
    const requestData = {
      type: NOTIFICATION_TYPES.FRIEND_REQUEST,
      senderId,
      senderName,
      recipientId,
      createdAt: serverTimestamp(),
      read: false,
      status: 'pending' // Estado inicial de la solicitud
    };

    await addDoc(collection(db, 'Notificaciones'), requestData);
    return { success: true };
  } catch (error) {
    console.error('Error al enviar solicitud de amistad:', error);
    return { success: false, error };
  }
};

// Suscribirse a las notificaciones de un usuario
export const subscribeToUserNotifications = (userId, callback) => {
  const q = query(
    collection(db, 'Notificaciones'),
    where('recipientId', '==', userId),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const notifications = [];
    snapshot.forEach((doc) => {
      notifications.push({ id: doc.id, ...doc.data() });
    });
    callback(notifications);
  });
};

// Suscribirse a solicitudes de amistad
export const subscribeToFriendRequests = (userId, callback) => {
  const q = query(
    collection(db, 'Notificaciones'),
    where('recipientId', '==', userId),
    where('type', '==', NOTIFICATION_TYPES.FRIEND_REQUEST),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const friendRequests = [];
    snapshot.forEach((doc) => {
      friendRequests.push({ id: doc.id, ...doc.data() });
    });
    callback(friendRequests);
  });
};

// Manejar solicitud de amistad (aceptar o rechazar)
export const handleFriendRequest = async (notificationId, action) => {
  try {
    const notificationRef = doc(db, 'Notificaciones', notificationId);

    const updatedData =
      action === 'accept'
        ? { status: 'accepted', read: true }
        : { status: 'rejected', read: true };

    await updateDoc(notificationRef, updatedData);

    return { success: true };
  } catch (error) {
    console.error('Error al manejar solicitud de amistad:', error);
    return { success: false, error };
  }
};

// Marcar todas las notificaciones como leídas
export const markAllNotificationsAsRead = async (userId) => {
  try {
    const q = query(
      collection(db, 'Notificaciones'),
      where('recipientId', '==', userId),
      where('read', '==', false)
    );

    const snapshot = await getDocs(q);
    const updatePromises = [];

    snapshot.forEach((doc) => {
      updatePromises.push(updateDoc(doc.ref, { read: true }));
    });

    await Promise.all(updatePromises);
    return { success: true };
  } catch (error) {
    console.error('Error al marcar todas las notificaciones como leídas:', error);
    return { success: false, error };
  }
};
