import {collection, getDocs, onSnapshot} from "firebase/firestore";
import {database} from "../../firebase";

export const getVideos = async () => {
    const q = collection(database, "videos");
    const snapshot = await getDocs(q);
    const videos = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
    return videos;
}