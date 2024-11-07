import { doc, deleteDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { database } from "../../firebase";

export const deleteUser = async (userId, authId) => {
  try {
    // First, delete the user from Firebase Authentication
    await deleteUserFromAuth(authId);
    // Then, delete the user document from Firestore
    await deleteUserDoc(userId);

    toast.success('Usuario eliminado correctamente');
  } catch (error) {
    console.error('Error deleting user:', error);
    toast.error('Error eliminando usuario');
  }
}

const deleteUserFromAuth = async (authId) => {
  try {
    console.log('Deleting user from Firebase Authentication:', authId);
    const response = await fetch('https://us-central1-grecialab-e2f39.cloudfunctions.net/deleteUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ authId })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log('User deleted from Firebase Authentication successfully:', authId);
  } catch (error) {
    console.error('Error deleting user from Firebase Authentication:', error);
    throw error;
  }
}

export const deleteUserDoc = async (userId) => {
  try {
    const userRef = doc(database, 'users', userId);
    await deleteDoc(userRef);
    console.log('User document deleted successfully:', userId);
  } catch (error) {
    console.error('Error deleting user document:', error);
    throw error;
  }
}