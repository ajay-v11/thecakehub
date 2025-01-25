// Import the functions you need from the SDKs you need
import {getApp, getApps, initializeApp} from 'firebase/app';
import {getAuth} from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyCSKrLO5eQfXvUNHeC07muE_3BncsJ12uU',
  authDomain: 'thecakehub-40166.firebaseapp.com',
  projectId: 'thecakehub-40166',
  storageBucket: 'thecakehub-40166.firebasestorage.app',
  messagingSenderId: '54998460112',
  appId: '1:54998460112:web:d6a38891a91d6e0a6060d5',
  measurementId: 'G-7NS8SFR8KY',
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
auth.useDeviceLanguage();
console.log(firebaseConfig); // Check if using production config
console.log(auth.config); // Validate current authentication setup
export {auth};
