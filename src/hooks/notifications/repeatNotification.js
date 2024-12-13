import {
  updateDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { database } from "../../firebase";

export const repeatBillingNotification = async (ticketId) => {
  // Necesito la notificacion que tenga ticketId y servicio no sea null.
  //Luego volver a crearla en base a esa notificacion.

  try {
    if (!ticketId) {
      throw new Error("ID de ticket inválido o no definido");
    }

    // Crear una referencia a la colección de notificaciones
    const notificationsRef = collection(database, "notifications");

    // Crear una consulta para obtener todas las notificaciones con el ticketId dado
    const q = query(notificationsRef, where("ticketId", "==", ticketId));

    // Obtener los documentos que coinciden con la consulta
    const querySnapshot = await getDocs(q);

    // Actualizar cada documento para establecer 'seen' en false
    const updatePromises = querySnapshot.docs.map((docSnapshot) => {
      return updateDoc(docSnapshot.ref, {
        seen: false,
        updatedAt: new Date(), // Opcional: actualizar la fecha de modificación
      });
    });

    // Esperar a que todas las actualizaciones se completen
    await Promise.all(updatePromises);

    console.log("Notifications updated to unseen successfully");
  } catch (error) {
    console.error("Error updating notifications:", error);
  }
};

export const repeatServiceNotification = async (ticketId) => {
  // Necesito la notificacion que tenga ticketId y servicio no sea null.
  //Luego volver a crearla en base a esa notificacion.
  const notificationRef = collection(database, "notifications");
  const q = query(
    notificationRef,
    where("ticketId", "==", ticketId),
    where("service", "!=", null),
    where("seen", "==", true)
  );
  const querySnapshot = await getDocs(q);
  const notification = querySnapshot.docs[0];
  await updateDoc(
    notification.ref,
    {
      seen: false,
      updatedAt: new Date(),
    }
  )
};
