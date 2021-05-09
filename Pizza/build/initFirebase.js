"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const admin = require("firebase-admin");
const AWS = require("aws-sdk");
const serviceAcc = require('../database_secret.json');
AWS.config.getCredentials((err) => {
    if (err)
        console.log(err.stack);
    else {
        console.log("👉S3 Connected");
    }
});
admin.initializeApp({
    credential: admin.credential.cert(serviceAcc)
});
console.log("👉Database connected");
// admin.firestore().settings({host : "http://localhost:8080", ssl : false})
const db = admin.firestore();
exports.default = db;
