import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { database } from '../../firebase';

export const addServiceAndQueue = async (service, queue) => {
    try {
        // Add queue document
        const queueRef = await addDoc(collection(database, 'queues'), queue);
        const queueId = queueRef.id;

        // Add service document with queueId reference
        const serviceRef = await addDoc(collection(database, 'services'), {
            ...service,
            queueId: queueId
        });
        const serviceId = serviceRef.id;

        // Update queue document with serviceId and other details
        const qName = service.name.slice(0, 2).toUpperCase();
        await updateDoc(doc(database, 'queues', queueId), {
            ...queue,
            id: queueId,
            serviceId: serviceId,
            name: qName,
            count: 0,
        });

        // Update service document with serviceId
        await updateDoc(doc(database, 'services', serviceId), {
            ...service,
            id: serviceId,
        });

        console.log('Service and Queue added successfully');
    } catch (error) {
        console.error('Error adding document: ', error);
    }
};