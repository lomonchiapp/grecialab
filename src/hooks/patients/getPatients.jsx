import {collection, getDocs, onSnapshot} from "firebase/firestore";
import {database} from "../../firebase";

export const getPatients = async () => {
    const q = collection(database, "patients");
    const snapshot = await getDocs(q);
    const patients = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
    return patients;
}