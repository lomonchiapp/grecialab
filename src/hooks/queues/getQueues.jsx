import { getDocs, collection } from "firebase/firestore"
import { database } from "../../firebase"

export const getQueues = async () => {
    const queuesCollection = collection(database, 'queues')
    const queuesSnapshot = await getDocs(queuesCollection)
    const queuesList = queuesSnapshot.docs.map(doc => doc.data())
    return queuesList
}