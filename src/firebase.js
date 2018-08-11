//import * as firebase from 'firebase';
// Import the Firebase modules that you need in your app.
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/firestore';

var config = {
    apiKey: "AIzaSyBKxV77gLvWSU8A44mak4m5-IML_Ixg4nY",
    authDomain: "eod-bot-local.firebaseapp.com",
    databaseURL: "https://eod-bot-local.firebaseio.com",
    projectId: "eod-bot-local",
    storageBucket: "eod-bot-local.appspot.com",
    messagingSenderId: "34337095436"
};

export default firebase.initializeApp(config);

