import { collection, getDocs, updateDoc, doc } from 'firebase/firestore'
import { database } from '../../firebase'
import { toast } from 'react-toastify'

export const resetAllQueuesCount = async () => {
  try {
    // Obtener referencia a la colección
    const queuesRef = collection(database, 'queues')
    
    // Obtener todos los documentos
    const querySnapshot = await getDocs(queuesRef)
    
    // Actualizar cada documento
    const updatePromises = querySnapshot.docs.map(doc => {
      return updateDoc(doc.ref, {
        count: 0
      })
    })
    toast.success('Todos los contadores han sido reiniciados')
    await Promise.all(updatePromises)
    return { success: true }
  } catch (error) {
    console.error('Error al reiniciar contadores:', error)
    return { success: false, error }
  }
}

export const resetQueueCount = async (queueId) => {
  try {
    // Obtener referencia al documento específico
    const queueRef = doc(database, 'queues', queueId)
    
    // Actualizar el contador a 0
    await updateDoc(queueRef, {
      count: 0
    })
    toast.success('Contador reiniciado exitosamente')
    return { success: true }
  } catch (error) {
    console.error('Error al reiniciar contador:', error)
    return { success: false, error }
  }
}