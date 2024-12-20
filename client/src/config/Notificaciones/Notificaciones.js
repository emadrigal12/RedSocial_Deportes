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
    FOLLOW: 'FOLLOW'
  };
  
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
  
  export const markNotificationAsRead = async (notificationId) => {
    try {
      const notificationRef = doc(db, 'Notificaciones', notificationId);
      await updateDoc(notificationRef, {
        read: true
      });
      return { success: true };
    } catch (error) {
      console.error('Error al marcar notificación como leída:', error);
      return { success: false, error };
    }
  };
  
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
        updatePromises.push(
          updateDoc(doc.ref, { read: true })
        );
      });
      
      await Promise.all(updatePromises);
      return { success: true };
    } catch (error) {
      console.error('Error al marcar todas las notificaciones como leídas:', error);
      return { success: false, error };
    }
  };