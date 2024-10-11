import {doc, getDoc, deleteDoc } from 'firebase/firestore';
import { database } from '../../firebase';

export const deleteBillingPosition = async (id) => {
    try {
        await deleteDoc(doc(database, 'billingPosition', id));
        console.log('Document successfully deleted');
    } catch (error) {
        console.error('Error removing document: ', error);
    }
}