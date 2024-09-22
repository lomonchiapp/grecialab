import {collection, addDoc, doc, updateDoc} from "firebase/firestore";
import {database} from "../../firebase";

export const newTicket = async (ticket, queue) => {
    try {
        const ticketRef = await addDoc(collection(database, 'tickets'), ticket);
        const newTicketData = { id: ticketRef.id, ...ticket } //Asegurandome que retorne el ticket actualizado
        await updateDoc(doc(database, 'queues', queue.id), {
            ...queue,
            count: queue.count + 1, 
        })
        return newTicketData.id
    } catch (error) {
        console.error('Error adding document: ', error);
    }
}