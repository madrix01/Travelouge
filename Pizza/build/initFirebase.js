"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const admin = require("firebase-admin");
const cloudinary = require("cloudinary");
console.log("👉Storage connected");
if (process.env.PRODUCTION === 'true') {
    const serviceAcc = require('../database_secret.json');
    admin.initializeApp({
        credential: admin.credential.cert(serviceAcc)
    });
    console.log("Database connected [Production]");
    cloudinary.v2.config({
        cloud_name: process.env.CN_NAME,
        api_key: process.env.CN_API_KEY,
        api_secret: process.env.CN_API_SECRET
    });
    console.log("Storage connected [Production]");
}
else {
    admin.initializeApp({ projectId: "travelouge-2fbf5" });
    console.log("Database connected [http://localhost:4000]");
    console.log("Storage connected [Local public folder]");
}
const db = admin.firestore();
exports.default = db;
