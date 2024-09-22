
import { getDocs, collection, query, where } from 'firebase/firestore';
import { database, FIREBASE_AUTH } from '../../firebase';

export const getUser = async () => {
    try {
        const user = FIREBASE_AUTH.currentUser;

        if (!user) {
            throw new Error('No user is logged in');
        }

        const usersCollectionRef = collection(database, 'users');
        const q = query(usersCollectionRef, where('email', '==', user.email));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            throw new Error('User document does not exist');
        }

        const userData = querySnapshot.docs[0].data();
        return userData;
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
    }
};