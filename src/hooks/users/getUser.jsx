import { getDocs, collection, query, where, doc, getDoc } from 'firebase/firestore';
import { database, FIREBASE_AUTH } from '../../firebase';

export const getUser = async () => {
  const user = FIREBASE_AUTH.currentUser;
  if (!user) {
    throw new Error('No user is logged in');
  }

  // Fetch user data from Firestore or any other source
  const userData = await fetchUserDataByEmail(user.email);
  return userData;
};

const fetchUserDataByEmail = async (email) => {
  // Implement your logic to fetch user data using the email
  // For example, fetching from Firestore:
  const q = query(collection(database, 'users'), where('email', '==', email));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    throw new Error('User data not found');
  }

  // Assuming email is unique, we can take the first document
  const userDoc = querySnapshot.docs[0];
  return userDoc.data();
};