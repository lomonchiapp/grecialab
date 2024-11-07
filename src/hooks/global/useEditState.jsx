import {create} from 'zustand'

export const useEditState = create((set) => ({
    userToEdit: null,
    userEditMode: false,
    setUserToEdit: (user) => set({userToEdit: user}),
    setUserEditMode: (mode) => set({userEditMode: mode})
}))