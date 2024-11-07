import {collection, addDoc, doc, updateDoc} from "firebase/firestore";
import {database} from "../../firebase";
import { toast } from "react-toastify";

export const newTicket = async (ticket, queues) => {
    try {
        const ticketRef = await addDoc(collection(database, 'tickets'), ticket);
        const newTicketData = { id: ticketRef.id, ...ticket }; // Ensure it returns the updated ticket
    
        // Iterate over each queue and update its count
        for (const queue of queues) {
          await updateDoc(doc(database, 'queues', queue.id), {
            ...queue,
            count: queue.count + 1,
          });
        }
    
        toast.success('Ticket creado');
        
        console.log('Ticket data before formatting:', ticket); // Log the ticket data
        return newTicketData.id;
    } catch (error) {
        console.error('Error adding document: ', error);
    }
};