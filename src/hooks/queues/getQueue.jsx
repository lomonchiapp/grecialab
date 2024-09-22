import { doc, getDoc } from 'firebase/firestore';
import { database } from '../../firebase';

export const getQueue = async (id) => {
  try {
    const queueDocRef = doc(database, 'queues', id);
    const queueDoc = await getDoc(queueDocRef);

    if (queueDoc.exists()) {
      return queueDoc.data();
    } else {
      console.error('No such document!');
      return null;
    }
  } catch (error) {
    console.error('Error fetching document:', error);
    throw error;
  }
};