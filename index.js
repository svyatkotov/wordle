// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCCLCtpQF0hclrK8jsHNUu0ZXWiJXD7-Sk",
    authDomain: "svyat-wordle.firebaseapp.com",
    databaseURL: "https://svyat-wordle-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "svyat-wordle",
    storageBucket: "svyat-wordle.appspot.com",
    messagingSenderId: "157007658268",
    appId: "1:157007658268:web:80a8b5e61b123f377a8ed9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
