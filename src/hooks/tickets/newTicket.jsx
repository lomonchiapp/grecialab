import {collection, addDoc, doc, updateDoc} from "firebase/firestore";
import {database} from "../../firebase";
import { toast } from "react-toastify";
import { sendPrintJob, formatPrintData } from "./print/addPrintJob";

export const newTicket = async (ticket, queue) => {
    try {
        const ticketRef = await addDoc(collection(database, 'tickets'), ticket);
        const newTicketData = { id: ticketRef.id, ...ticket }; // Ensure it returns the updated ticket
        await updateDoc(doc(database, 'queues', queue.id), {
            ...queue,
            count: queue.count + 1, 
        });
        toast.success('Ticket creado');
        
        console.log('Ticket data before formatting:', ticket); // Log the ticket data
        const printData = formatPrintData(ticket);
        console.log('Formatted Print Data:', printData); // Log the print data
       // sendPrintJob(printData);
        
        return newTicketData.id;
    } catch (error) {
        console.error('Error adding document: ', error);
    }
};