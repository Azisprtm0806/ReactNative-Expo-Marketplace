// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCTsp4EYrUGDGw5-wPaVxY3gcQCnRhWikM",
  authDomain: "learn-d8ad7.firebaseapp.com",
  projectId: "learn-d8ad7",
  storageBucket: "learn-d8ad7.appspot.com",
  messagingSenderId: "653509999937",
  appId: "1:653509999937:web:6f94ec9daa9bafbd3435c0",
  measurementId: "G-K0GEVZDS7Q",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
