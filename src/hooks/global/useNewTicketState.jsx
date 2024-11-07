import {create} from 'zustand'

export const useNewTicketState = create((set) => ({
    ticketCode: '',
    patientName: '',
    selectedServices: [],
    selectedQueues: [],
    setTicketCode: (code) => set({ticketCode: code}),
    setPatientName: (name) => set({patientName: name}),
    setSelectedServices: (services) => set({selectedServices: services}),
    setSelectedQueues: (queues) => set({selectedQueues: queues}),
    reset: () => set({ticketCode: '', patientName: '', selectedServices: [], selectedQueues: []})
}))
