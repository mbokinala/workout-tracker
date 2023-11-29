import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyCxdJDqFNR6B1pgNGWYRRtFa4guF7EpOrI",
  authDomain: "hopeful-kingdom-406621.firebaseapp.com",
  projectId: "hopeful-kingdom-406621",
  storageBucket: "hopeful-kingdom-406621.appspot.com",
  messagingSenderId: "52521385095",
  appId: "1:52521385095:web:af0d5ab2a294bfe3a34c22",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
