import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyB0b0QZGLTpbBZinvRqvKy-bzC3j-iYUIc",
    authDomain: "lateral-command-430811-c5.firebaseapp.com",
    projectId: "lateral-command-430811-c5",
    storageBucket: "lateral-command-430811-c5.appspot.com",
    messagingSenderId: "136233513403",
    appId: "1:136233513403:web:3009a6a5b184aa9e16549e",
    measurementId: "G-1LFL7C3XWE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
export { auth, googleProvider, facebookProvider, analytics };
