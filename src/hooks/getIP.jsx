import { database } from "../firebase"
import { getDoc, doc } from "firebase/firestore";

export const getIP = async () => {
  try {
    const ipDocRef = doc(database, "networkIPs", "localIP");
    const ipDoc = await getDoc(ipDocRef);
    if (ipDoc.exists()) {
      return ipDoc.data().ip;
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching document:", error);
    throw error;
  }
};