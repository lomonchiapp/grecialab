import {getDoc, doc, query, where} from 'firebase/firestore';
import {database} from '../../firebase';

export const getTicket = async (id) => {
    try {
        const ticketDocRef = doc(database, 'tickets', id);
        const ticketDoc = await getDoc(ticketDocRef);
    
        if (ticketDoc.exists()) {
            return ticketDoc.data();
        } else {
            console.error('No such document!');
            return null;
        }
    } catch (error) {
        console.error('Error fetching document:', error);
        throw error;
    }
}
