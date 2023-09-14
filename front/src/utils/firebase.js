import firebase from "firebase/compat/app";
import "firebase/compat/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC2pRmeDsy_q0pjRI7LOneIXjSQHE_UMbA",
  authDomain: "sfdb-394203.firebaseapp.com",
  projectId: "sfdb-394203",
  storageBucket: "sfdb-394203.appspot.com",
  messagingSenderId: "266208771379",
  appId: "1:266208771379:web:8e6778a2435c486a2dd246",
  measurementId: "G-RYBHGGV295",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const firebaseStorage = firebase.storage();
