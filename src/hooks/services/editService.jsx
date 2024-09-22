import {doc, updateDoc} from 'firebase/firestore';
import {database} from '../../firebase';

export const editService = async (service, queue) => {
    try {
        await updateDoc(doc(database, 'services', service.id), service);
        await updateDoc(doc(database, 'queues', queue.id), queue);
    } catch (error) {
        console.error('Error updating document: ', error);
    }
}