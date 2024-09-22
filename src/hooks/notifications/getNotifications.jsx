import { database } from "../../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { toast } from "react-toastify";


export const getNotifications = (callback, onNewNotification) => {
    const notificationsCollection = collection(database, 'notifications');
    const unsubscribe = onSnapshot(notificationsCollection, (snapshot) => {
      const notificationsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(notificationsList);
   // Show toast notifications for new notifications
   snapshot.docChanges().forEach(change => {
    if (change.type === 'added') {
      const notification = change.doc.data();
      onNewNotification(notification);
    }
  });
});
return unsubscribe;
};