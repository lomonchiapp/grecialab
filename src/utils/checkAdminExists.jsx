import {getDocs, collection } from 'firebase/firestore'
import { database } from '../firebase';

export const checkAdminExists = async () => {
    const querySnapshot = await getDocs(collection(database, 'users'));
    const adminExists = querySnapshot.docs.some(doc => doc.data().role === 'admin');
    if (!adminExists) {
      navigate('/install');
    }
  };