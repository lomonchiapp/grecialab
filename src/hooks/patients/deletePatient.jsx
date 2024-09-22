import {doc, getDoc, deleteDoc } from 'firebase/firestore';
import { database } from '../firebase';

export const deletePatient = async (id) => {
    try {
        await deleteDoc(doc(database, 'patients', id));
        console.log('Document successfully deleted');
    } catch (error) {
        console.error('Error removing document: ', error);
    }
}