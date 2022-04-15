var admin = require("firebase-admin");

var serviceAccount = require("./firebase.json");

const firebaseAdminInitializeApp = () => {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

module.exports = firebaseAdminInitializeApp