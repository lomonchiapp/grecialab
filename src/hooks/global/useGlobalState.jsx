import { create } from "zustand";
import { getPatients } from "../patients/getPatients";
import { getServices } from "../services/getServices";
import { getQueues } from "../queues/getQueues";
import { getUsers } from "../users/getUsers";
import { getTickets } from "../tickets/getTickets";
import { database } from "../../firebase";
import { collection, onSnapshot } from "firebase/firestore";

export const useGlobalState = create((set) => ({
  patients: [],
  services: [],
  selectedService: null,
  queues: [],
  selectedQueue: null,
  users: [],
  tickets: [],
  selectedTicket: null,
  setPatients: (patients) => set({ patients }),
  setServices: (services) => set({ services }),
  setSelectedService: (selectedService) => set({ selectedService }),
  setTickets: (tickets) => set({ tickets }),
  setSelectedTicket: (selectedTicket) => set({ selectedTicket }),
  setQueues: (queues) => set({ queues }),
  setSelectedQueue: (selectedQueue) => set({ selectedQueue }),
  setUsers: (users) => set({ users }),
  fetchPatients: async () => {
    const patients = await getPatients();
    set({ patients });
  },
  fetchServices: async () => {
    const services = await getServices();
    set({ services });
  },
  fetchQueues: () => {
    const unsubscribe = getQueues((queues) => {
      set({ queues });
    });
    return unsubscribe;
  },
  fetchUsers: async () => {
    const users = await getUsers();
    set({ users });
  },
  fetchTickets: async () => {
    const tickets = await getTickets();
    set({ tickets });
  },
  // Firestore Subscription
  subscribeToTickets: () => {
    const q = collection(database, "tickets");
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      set({ tickets: data });
      console.log("Tickets data:", data);
    });
    return unsubscribe;
  },
  subscribeToQueues: () => {
    const unsubscribe = getQueues((queues) => {
      set({ queues });
    });
    return unsubscribe;
  }
}));