import { collection, addDoc, Timestamp } from "firebase/firestore";
import { database } from "../../../firebase";

export const addPrintJob = async (ticket) => {
  try {
    const docRef = await addDoc(collection(database, "printQueue"), {
      ...ticket,
      printedAt: Timestamp.now(),
    });
    console.log("Print job added with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding print job: ", e);
  }
};

export const formatPrintData = (data) => {
  return `
  RECIBO DE TURNO
  ----------------
  -----Ticket-----
  \x1b\x21\x30----${data.ticketCode}----\x1b\x21\x00
  ----------------
  Paciente: ${data.patientName}
  Fecha: ${new Date().toLocaleDateString()}
  Servicio: ${data.service}
  ----------------
  
  `;
}

export const sendPrintJob = async (printData) => {
  try {
    const response = await fetch('http://localhost:3000/print', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: printData }),  // Send print content as data
    });

    if (response.ok) {
      console.log('Print job sent successfully');
    } else {
      console.error('Error sending print job');
    }
  } catch (error) {
    console.error('Error:', error);
  }
};