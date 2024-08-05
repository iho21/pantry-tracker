// firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDr84WMf4MwZNOf_oIOukxJoiPz_ebK57I",
  authDomain: "pantry-manager-58922.firebaseapp.com",
  projectId: "pantry-manager-58922",
  storageBucket: "pantry-manager-58922.appspot.com",
  messagingSenderId: "817918393071",
  appId: "1:817918393071:web:738ae4084cc824c953791a",
  measurementId: "G-6JNG7X4SPD"
};

let firestore;

if (typeof window !== 'undefined') {
  const app = initializeApp(firebaseConfig);
  firestore = getFirestore(app);
}

export { firestore };
