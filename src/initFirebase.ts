import * as admin from "firebase-admin";

const serviceAcc = require('../database_secret.json');


admin.initializeApp({
    credential : admin.credential.cert(serviceAcc)
})

console.log("Database connected");
const db = admin.firestore();


export default db;
