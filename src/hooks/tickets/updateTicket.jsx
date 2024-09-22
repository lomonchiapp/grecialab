import {database} from '../../firebase';
import {updateDoc, doc, getDoc} from 'firebase/firestore';
import { toast } from 'react-toastify';
import { addNotification } from '../notifications/addNotification';
import { useGlobalState } from '../global/useGlobalState';

// Esta funcion es para pasar el turno de espera a un puesto de atención
export const updateToProcessing = async (ticketId, user, services) => {
    const ticketRef = doc(database, 'tickets', ticketId);
    const ticketSnap = await getDoc(ticketRef);
    const serviceName = (serviceId) => {
      const service = services.find((service) => service.id === serviceId);
      return service ? service.name : 'Unknown Service';
    };
  
    if (ticketSnap.exists()) {
      await updateDoc(ticketRef, {
        status: 'processing',
        user: user,
        updatedAt: new Date(),
      });
      toast.success('Turno de paciente transferido a tu puesto.');
      addNotification({
        title: `Paciente a Puesto de ${serviceName(ticketSnap.data().service)}`,
        message: `El paciente ${ticketSnap.data().patientName} con turno ${ticketSnap.data().ticketCode} esta siendo atendido en ${serviceName(ticketSnap.data().service)}.`,
        user: user,
        createdAt: new Date(),
      });
    }
  };
// Esta funcion es para dar el turno por terminado (final del ciclo de atención)
export const updateToFinished = async (ticketId, user) => {
    const ticketRef = doc(database, 'tickets', ticketId);
    const ticketSnap = await getDoc(ticketRef);

    if (ticketSnap.exists()) {
        await updateDoc(ticketRef, {
            status: 'finished',
            user: user,
            finishedAt: new Date(),
            updatedAt: new Date(),
        });
        toast.success('Turno de paciente finalizado.');
    }
}
// Esta funcion es para cancelar el turno desde el puesto de atención
export const updateToCancelled = async (ticketId, user) => {
    const ticketRef = doc(database, 'tickets', ticketId);
    const ticketSnap = await getDoc(ticketRef);

    if (ticketSnap.exists()) {
        await updateDoc(ticketRef, {
            status: 'cancelled',
            user: user,
            updatedAt: new Date(),
            cancelledAt: new Date(),
        });
        toast.update('Turno de paciente cancelado.');
    }
}
// Esta funcion es para pasar el turno de espera a facturación

export const updateToBilling = async (ticketId, user) => {
    const ticketRef = doc(database, 'tickets', ticketId);
    const ticketSnap = await getDoc(ticketRef);

    if (ticketSnap.exists()) {
        await updateDoc(ticketRef, {
            status: 'billing',
            user: user,
            updatedAt: new Date(),
            billingAt: new Date(),
        });
        toast.success('Turno de paciente en facturación.');
    }
}
 // Esta funcion es para cancelar el turno desde facturación

export const updateToBCancelled = async (ticketId, user) => {
    const ticketRef = doc(database, 'tickets', ticketId);
    const ticketSnap = await getDoc(ticketRef);

    if (ticketSnap.exists()) {
        await updateDoc(ticketRef, {
            status: 'Bcancelled',
            user: user,
            updatedAt: new Date(),
            BcancelledAt: new Date(),
        });
        toast.error('Turno de paciente cancelado en facturación.');
    }
}
// Esta funcion es para pasar el turno de facturación a la cola de espera
// Aqui es donde se va a imprimir el ticket

export const updateToBilled = async (ticketId, user) => {
    const ticketRef = doc(database, 'tickets', ticketId);
    const ticketSnap = await getDoc(ticketRef);

    if (ticketSnap.exists()) {
        await updateDoc(ticketRef, {
            status: 'inQueue',
            user: user,
            updatedAt: new Date(),
            billedAt: new Date(),
        });
        toast.success('Turno de paciente facturado.');
    }
}