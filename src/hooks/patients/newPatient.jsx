import {collection, addDoc, doc, updateDoc} from "firebase/firestore";
import {database} from "../../firebase";

export const newPatient = async (patient) => {
    try {
        const patientRef = await addDoc(collection(database, 'patients'), patient);
        return patientRef.id
    } catch (error) {
        console.error('Error adding document: ', error);
    }
}