import { getDocs, collection } from "firebase/firestore"
import { database } from "../../firebase"

export const getUsers = async () => {
    const usersCollection = collection(database, 'users')
    const usersSnapshot = await getDocs(usersCollection)
    const users = usersSnapshot.docs.map(doc => doc.data())
    return users
}   