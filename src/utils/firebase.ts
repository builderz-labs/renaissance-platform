// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "@firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDN6TJ_wS3t5mJ_M8n3pNsnnr4MECBtfV8",
  authDomain: "renaissance-381919.firebaseapp.com",
  projectId: "renaissance-381919",
  storageBucket: "renaissance-381919.appspot.com",
  messagingSenderId: "553682598299",
  appId: "1:553682598299:web:9566b807cc445470a4c93e",
  measurementId: "G-KBX1437N3E",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
// export const analytics = getAnalytics(app);
