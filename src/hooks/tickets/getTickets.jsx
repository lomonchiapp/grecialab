import {collection, getDocs, onSnapshot} from "firebase/firestore";
import {database} from "../../firebase";

export const getTickets  = async () => {
    const q = collection(database, 'tickets');
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }))
    return data
}