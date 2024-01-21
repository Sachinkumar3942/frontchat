import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyChcUkFizHmtX_cITotAci5QCjOfn1_4ro",
  authDomain: "chat-173eb.firebaseapp.com",
  projectId: "chat-173eb",
  storageBucket: "chat-173eb.appspot.com",
  messagingSenderId: "951563535576",
  appId: "1:951563535576:web:7ae2eb8da5ae27f70c83ad"
};


export const app = initializeApp(firebaseConfig);
export const auth=getAuth();
export const storage=getStorage();
export const db=getFirestore()