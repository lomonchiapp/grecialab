import { doc, getDoc } from 'firebase/firestore';
import { database } from '../../firebase';

export const getService = async (id) => {
  try {
    const serviceDocRef = doc(database, 'services', id);
    const serviceDoc = await getDoc(serviceDocRef);

    if (serviceDoc.exists()) {
      return serviceDoc.data();
    } else {
      console.error('No such document!');
      return null;
    }
  } catch (error) {
    console.error('Error fetching document:', error);
    throw error;
  }
};