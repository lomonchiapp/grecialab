import { database } from '../../firebase';
import { toast } from 'react-toastify';
import { addDoc, collection } from 'firebase/firestore';
import { useGridColumnGrouping } from '@mui/x-data-grid/internals';

export const createUser = async (user) => {
    try {
        const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${import.meta.env.VITE_FIREBASE_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: user.email,
                password: user.password,
                returnSecureToken: true, // Ensure the secure token is returned
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error creating user:', errorData);
            throw new Error('Error creating user');
        }

        const data = await response.json();
        const userId = data.localId;

        // Create user document in Firestore
        const userDoc = {
            id: userId,
            email: user.email,
            name: user.name,
            role: user.role, // Add any additional user data here
        };

        if (user.service) {
            userDoc.service = user.service;
        }

        await addDoc(collection(database, 'users'), userDoc);

        toast.success('Usuario creado con éxito');
    } catch (error) {
        console.error('Error:', error);
        toast.error('Error creating user');
    }
};