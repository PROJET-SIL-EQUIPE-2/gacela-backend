const firebase = require("firebase/app")
const firestore = require("firebase/firestore")
const { getStorage, ref, uploadBytes } = require("firebase/storage");

const firebaseConfig = {
    apiKey: "AIzaSyAb-SsyffJFAAnJqWUsbT_8RX--RlFaR9c",
    authDomain: "gacelaapp-91a37.firebaseapp.com",
    projectId: "gacelaapp-91a37",
    storageBucket: "gacelaapp-91a37.appspot.com",
    messagingSenderId: "68117693941",
    appId: "1:68117693941:web:d142cbdfc9536bac9b4cbc"
};

const fireapp = firebase.initializeApp(firebaseConfig)

// Create a root reference
const storage = getStorage();
module.exports = {
    firestore,
    fireapp,
    storage,
    ref,
    uploadBytes
}