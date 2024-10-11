import {collection, addDoc, doc, updateDoc} from "firebase/firestore";
import {database} from "../../firebase";

export const newVideo = async (video) => {
    try {
        const videoRef = await addDoc(collection(database, 'videos'), video);
        return videoRef.id
    } catch (error) {
        console.error('Error adding document: ', error);
    }
}