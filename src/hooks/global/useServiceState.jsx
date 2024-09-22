import {create} from 'zustand'
import { getServices } from '../services/getServices'
import { getQueues } from '../queues/getQueues'

export const useServiceState = create((set) => ({
    services: [],
    queues: [],
    setServices: (services) => set({services}),
    setQueues: (queues) => set({queues}),
    fetchServices: async () => {
        const services = await getServices()
        set({services})
    },
    fetchQueues: async () => {
        const queues = await getQueues()
        set({queues})
    }
}))


