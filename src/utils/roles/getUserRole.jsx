import { getDocs, collection, query, where } from 'firebase/firestore';
import { database } from '../../firebase';

export const getUserRole = async (email) => {
  try {
    const usersCollectionRef = collection(database, 'users');
    const q = query(usersCollectionRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      throw new Error('User document does not exist');
    }

    const userData = querySnapshot.docs[0].data();
    return userData.role;
  } catch (error) {
    console.error('Error fetching user role:', error);
    throw error;
  }
};