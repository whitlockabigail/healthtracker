import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const config = {
  apiKey: "AIzaSyAfsWPucjkyc9Q1NWgyzB7n3x7o6-rtdIw",
  authDomain: "auth-d3325.firebaseapp.com",
  databaseURL: "https://auth-d3325.firebaseio.com",
  projectId: "auth-d3325",
  storageBucket: "",
  messagingSenderId: "745798849549",
  appId: "1:745798849549:web:157fb67e31f59e182db144"
};

firebase.initializeApp(config);

export const auth = firebase.auth();

export const db = firebase.firestore();
