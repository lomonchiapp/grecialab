import {create} from 'zustand'
import { getTickets } from '../tickets/getTickets'

export const useQstate = create((set) => ({
    tickets: [],
    queues: [],
    selectedQ: null,
    setQueues: (queues) => set({queues}),
    setSelectedQ: (selectedQ) => set({selectedQ}),
    setTickets: (tickets) => set({tickets}),
    fetchTickets: async () => {
        const tickets = await getTickets()
        set({tickets})
    },
    addTicket: (ticket) => set((state) => ({tickets: [...state.tickets, ticket]})),
    deleteTicket: (id) => set((state) => ({tickets: state.tickets.filter((ticket) => ticket.id !== id)})),
    updateTicket: (ticket) => set((state) => ({tickets: state.tickets.map((t) => (t.id === ticket.id ? ticket : t))}))
}))