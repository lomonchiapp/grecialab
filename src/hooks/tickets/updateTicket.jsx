import { database } from "../../firebase";
import { updateDoc, doc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { addNotification } from "../notifications/addNotification";
import { useGlobalState } from "../global/useGlobalState";
import { sendTextToSpeech } from "../../utils/speech/sendTextToSpeech";

// Esta funcion es para pasar el turno de espera a facturación

export const updateToBilling = async (ticketId, user) => {
  const ticketRef = doc(database, "tickets", ticketId);
  const ticketSnap = await getDoc(ticketRef);
  const speechText = `Paciente ${ticketSnap.data().patientName}, con turno 
  ${ticketSnap.data().ticketCode}, favor pasar a puesto de facturación ${
    user.billingPosition.name
  }`;

  if (ticketSnap.exists()) {
    await updateDoc(ticketRef, {
      status: "billing",
      billingPosition: user.billingPosition,
      user: user,
      updatedAt: new Date(),
      billingAt: new Date(),
    });
    addNotification({
      title: `Paciente a Puesto de Facturación ${user.billingPosition.name}`,
      message: `El paciente ${ticketSnap.data().patientName} con turno ${
        ticketSnap.data().ticketCode
      } pase a ${user.billingPosition.name}.`,
      user: user,
      billingPosition: user.billingPosition,  // Se agrega el puesto de facturación  
      seen: false,
      ticket: ticketId,
      createdAt: new Date(),
    });
    toast.success("Turno de paciente en facturación.");
    sendTextToSpeech(speechText);
  }
};

// Esta funcion es para pasar el turno de espera a un puesto de atención
export const updateToProcessing = async (ticketId, user, services) => {
  const ticketRef = doc(database, "tickets", ticketId);
  const ticketSnap = await getDoc(ticketRef);

  if (ticketSnap.exists()) {
    const existingServices = ticketSnap.data().services;
    const updatedServices = existingServices.map((existingService) => {
      const serviceToUpdate = user.services.find(
        (userService) => userService.id === existingService.id
      );
      if (serviceToUpdate) {
        return { ...existingService, status: "processing" };
      }
      return existingService;
    });


    await updateDoc(ticketRef, {
      services: updatedServices, // Se actualiza el estado de los servicios
      status: "processing",
      user: user,
      updatedAt: new Date(),
    });

    const matchingService = user.services.find(userService =>
      ticketSnap.data().services.some(service => service.id === userService.id)
    );

    toast.success("Turno de paciente transferido a tu puesto.");

    // CREACION DE LA NOTIFICACION
    addNotification({
      title: `Paciente a Puesto de ${matchingService.name}`,
      message: `El paciente ${ticketSnap.data().patientName} con turno ${
        ticketSnap.data().ticketCode
      } esta siendo atendido en ${matchingService.name}.`,
      user: user,
      service: matchingService,
      seen: false,
      ticketId: ticketId,
      createdAt: new Date(),
    });

    //TEXTO A VOZ
    const speechText = `${ticketSnap.data().patientName}, con turno, ${
      ticketSnap.data().ticketCode
    }, favor pasar al puesto de servicio ${
      matchingService.name
    }`;
    sendTextToSpeech(speechText);
  } else {
    console.error("No such document!");
  }
};
// Esta funcion es para dar el turno por terminado (final del ciclo de atención)
// Esta funcion es para dar el turno por terminado (final del ciclo de atención)
export const updateToFinished = async (ticketId, user) => {
  const ticketRef = doc(database, "tickets", ticketId);
  const ticketSnap = await getDoc(ticketRef);

  if (ticketSnap.exists()) {
    const existingServices = ticketSnap.data().services;

    // Update the status of the matching service to "finished"
    const updatedServices = existingServices.map((existingService) => {
      const serviceToUpdate = user.services.find(
        (userService) => userService.id === existingService.id
      );
      if (serviceToUpdate) {
        return { ...existingService, status: "finished" };
      }
      return existingService;
    });

    // Check if all services are finished
    const allServicesFinished = updatedServices.every(service => service.status === "finished");

    // Find the matching service from the user's services
    const matchingService = user.services.find(userService =>
      existingServices.some(service => service.id === userService.id)
    );

    await updateDoc(ticketRef, {
      services: updatedServices,
      status: allServicesFinished ? "finished" : "inQueue",
      user: user,
      finishedAt: new Date(),
      updatedAt: new Date(),
    });

    toast.success(`Turno de paciente para el servicio ${matchingService.name} finalizado.`);
    if (allServicesFinished) {
      toast.success("Turno de paciente finalizado completamente.");
    }
  }
};
// Esta funcion es para cancelar el turno desde el puesto de atención
export const updateToCancelled = async (ticketId, user) => {
  const ticketRef = doc(database, "tickets", ticketId);
  const ticketSnap = await getDoc(ticketRef);

  if (ticketSnap.exists()) {
    await updateDoc(ticketRef, {
      status: "cancelled",
      user: user,
      updatedAt: new Date(),
      cancelledAt: new Date(),
    });
    toast.update("Turno de paciente cancelado.");
  }
};

// Esta funcion es para cancelar el turno desde facturación

export const updateToBCancelled = async (ticketId, user) => {
  const ticketRef = doc(database, "tickets", ticketId);
  const ticketSnap = await getDoc(ticketRef);

  if (ticketSnap.exists()) {
    await updateDoc(ticketRef, {
      status: "Bcancelled",
      user: user,
      updatedAt: new Date(),
      BcancelledAt: new Date(),
    });
    toast.error("Turno de paciente cancelado en facturación.");
  }
};
// Esta funcion es para pasar el turno de facturación a la cola de espera
// Aqui es donde se va a imprimir el ticket

export const updateToBilled = async (ticketId, user) => {
  const ticketRef = doc(database, "tickets", ticketId);
  const ticketSnap = await getDoc(ticketRef);

  if (ticketSnap.exists()) {
    await updateDoc(ticketRef, {
      status: "inQueue",
      user: user,
      updatedAt: new Date(),
      billedAt: new Date(),
    });
    toast.success("Turno de paciente facturado.");
  }
};
