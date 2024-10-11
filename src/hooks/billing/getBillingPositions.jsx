import {collection, getDocs, onSnapshot} from "firebase/firestore";
import {database} from "../../firebase";

export const getBillingPositions = async () => {
    const q = collection(database, "billingPositions");
    const snapshot = await getDocs(q);
    const billingPositions = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
    return billingPositions;
}