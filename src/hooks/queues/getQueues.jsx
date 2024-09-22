import { collection, onSnapshot } from "firebase/firestore";
import { database } from "../../firebase";

export const getQueues = (callback) => {
  const queuesCollection = collection(database, 'queues');
  const unsubscribe = onSnapshot(queuesCollection, (snapshot) => {
    const queuesList = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(queuesList);
  });
  return unsubscribe;
};