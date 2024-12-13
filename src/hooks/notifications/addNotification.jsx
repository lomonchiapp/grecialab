import {addDoc, collection } from 'firebase/firestore'
import {database} from '../../firebase'

export const addNotification = async (notification) => {
    try {
        const notificationSnap = await addDoc(collection(database,'notifications'), notification)

        const notificationWithId = {
            ...notification,
            id: notificationSnap.id
        }

        return notificationWithId
    } catch (e) {
        console.error('Error adding document: ', e)
    }
}

export const addRepeatNotification = async (notification) => {
    try {
        await addDoc(collection(database,'notifications'), {
            ...notification,
            isRepeat: true
        })
    } catch (e) {
        console.error('Error adding document: ', e)
    }
}