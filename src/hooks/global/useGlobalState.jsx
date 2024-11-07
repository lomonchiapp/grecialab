import { create } from "zustand";
import { getPatients } from "../patients/getPatients";
import { getServices } from "../services/getServices";
import { getQueues } from "../queues/getQueues";
import { getUsers } from "../users/getUsers";
import { getTickets } from "../tickets/getTickets";
import { database } from "../../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { getVideos } from "../videos/getVideos";
import { getIP } from "../getIP";
import { getBillingPositions } from "../billing/getBillingPositions";

export const useGlobalState = create((set) => ({
  serverIP: "",
  patients: [],
  services: [],
  selectedServices: [],
  queues: [],
  billingPositions: [],
  videos: [],
  selectedQueues: [],
  users: [],
  tickets: [],
  selectedTicket: null,
  setServerIP: (serverIP) => set({ serverIP }),
  setVideos: (videos) => set({ videos }),
  setPatients: (patients) => set({ patients }),
  setServices: (services) => set({ services }),
  setBillingPositions: (billingPositions) => set({ billingPositions }),
  setSelectedServices: (selectedServices) => set({ selectedServices }),
  setTickets: (tickets) => set({ tickets }),
  setSelectedTicket: (selectedTicket) => set({ selectedTicket }),
  setQueues: (queues) => set({ queues }),
  setSelectedQueues: (selectedQueues) => set({ selectedQueues }),
  setUsers: (users) => set({ users }),
  fetchIP: async () => {
    const serverIP = await getIP();
    set({ serverIP });
  },
  fetchPatients: async () => {
    const patients = await getPatients();
    set({ patients });
  },
  fetchServices: async () => {
    const services = await getServices();
    set({ services });
  },
  fetchQueues: async () => {
    const queues = await getQueues();
    set({ queues });
  },
  fetchUsers: async () => {
    const users = await getUsers();
    set({ users });
  },
  fetchTickets: async () => {
    const tickets = await getTickets();
    set({ tickets });
  },
  fetchVideos: async () => {
    const videos = await getVideos();
    set({ videos });
  },
  fetchBillingPositions: async () => {
    const billingPositions = await getBillingPositions();
    set({ billingPositions });
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
    const q = collection(database, "queues");
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      set({ queues: data });
      console.log("Queues data:", data);
    });
    return unsubscribe;
  }
}));
