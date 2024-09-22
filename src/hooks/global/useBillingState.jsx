import {create} from 'zustand'

export const useBillingState = create((set) => ({
    billingTickets: [],
    setBillingTickets: (tickets) => set({billingTickets: tickets}),
    clearBillingTickets: () => set({billingTickets: []}),
}))
