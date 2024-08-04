// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDr84WMf4MwZNOf_oIOukxJoiPz_ebK57I",
  authDomain: "pantry-manager-58922.firebaseapp.com",
  projectId: "pantry-manager-58922",
  storageBucket: "pantry-manager-58922.appspot.com",
  messagingSenderId: "817918393071",
  appId: "1:817918393071:web:738ae4084cc824c953791a",
  measurementId: "G-6JNG7X4SPD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);

export {firestore}