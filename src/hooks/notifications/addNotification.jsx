import {addDoc, collection } from 'firebase/firestore'
import {database} from '../../firebase'

export const addNotification = async (notification) => {
    try {
        await addDoc(collection(database,'notifications'), notification)
    } catch (e) {
        console.error('Error adding document: ', e)
    }
}