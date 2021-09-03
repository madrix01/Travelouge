"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const admin = require("firebase-admin");
const serviceAcc = require('../database_secret.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAcc)
});
console.log("👉Database connected");
// admin.firestore().settings({host : "http://localhost:8080", ssl : false})
const db = admin.firestore();
exports.default = db;
