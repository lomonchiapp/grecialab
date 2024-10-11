import {collection, addDoc, doc, updateDoc} from "firebase/firestore";
import {database} from "../../firebase";

export const newBillingPosition = async (data) => {
    try {
        const bpRef = await addDoc(collection(database, 'billingPositions'), data);
        return bpRef.id
    } catch (error) {
        console.error('Error adding document: ', error);
    }
}