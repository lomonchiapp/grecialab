import {create} from 'zustand'
import { getUser } from '../users/getUser'

export const useUserState = create((set) => ({
    user: null,
    setUser: (user) => set({user}),
    fetchUser: async () => {
        const user = await getUser()
        set({user})
    }
}))