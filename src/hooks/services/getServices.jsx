import { getDocs, collection } from "firebase/firestore"
import { database } from "../../firebase"

export const getServices = async () => {
    const servicesCollection = collection(database, 'services')
    const servicesSnapshot = await getDocs(servicesCollection)
    const servicesList = servicesSnapshot.docs.map(doc => doc.data())
    return servicesList
}