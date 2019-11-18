import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const config = {
  apiKey: "AIzaSyB24xfHlR694j_WA0LA6IdY_MXAy2NJwIQ",
  authDomain: "healthtracker-84467.firebaseapp.com",
  databaseURL: "https://healthtracker-84467.firebaseio.com",
  projectId: "healthtracker-84467",
  storageBucket: "healthtracker-84467.appspot.com",
  messagingSenderId: "1055942032024",
  appId: "1:1055942032024:web:e475afa842862cfb542eed"
};

firebase.initializeApp(config);

export const auth = firebase.auth();

export const db = firebase.firestore();
