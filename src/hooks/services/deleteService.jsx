import { doc, deleteDoc, where } from 'firebase/firestore';
import { database } from '../../firebase';

export const deleteService = async (service, queue) => {
    try {
        await deleteDoc(doc(database, 'services', service.id));
        await deleteDoc(doc(database, 'queues', queue.id));  
    } catch (error) {
        console.error('Error deleting document: ', error);
    }
}