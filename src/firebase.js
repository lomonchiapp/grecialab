// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import {getAuth, setPersistence, browserLocalPersistence} from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyDFSA4xTqO_JdRthiGXTaA4LVBOA0NYXb8",
  authDomain: "grecialab-e2f39.firebaseapp.com",
  projectId: "grecialab-e2f39",
  storageBucket: "grecialab-e2f39.appspot.com",
  messagingSenderId: "800641985090",
  appId: "1:800641985090:web:0b1ffcc33a8005d3e9dbdb"
};
// Initialize Firebase

initializeApp(firebaseConfig);

export const database = getFirestore();

export const FIREBASE_APP = initializeApp(firebaseConfig);

export const FIREBASE_AUTH = getAuth(FIREBASE_APP);

// Set Persistence to local
setPersistence(FIREBASE_AUTH, browserLocalPersistence).then(() => {
  // Existing and future Auth states are now persisted in the current
  // session only. Closing the window would clear any existing state even
  // if a user forgets to sign out.
  // ...
  console.log('Persistence set to local');
}
).catch((error) => {
  // Handle Errors here.
  const errorCode = error.code;
  const errorMessage = error.message;
  console.error('Error setting persistence:', errorCode, errorMessage);
});

