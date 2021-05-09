"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const router = express.Router();
const initFirebase_1 = require("@src/initFirebase");
const aquarelle = require("aquarelle");
const userRef = initFirebase_1.default.collection('users');
router.get('/search', async (req, res) => {
    const snapShot = await userRef.where("username", "==", req.query.q).get().then(async (data) => {
        if (data.empty) {
            return res.json({ "error": "no user found" });
        }
        const temp = [];
        data.forEach((doc) => {
            temp.push(doc.data());
        });
        res.send(temp);
    });
    res.send(req.query.searchq);
});
router.get("/up", async (req, res) => {
    const x = await aquarelle(128, 128, 'public/uploads').then(console.log("Uploaded"));
    res.send(`${x.filePath} ${x.fileName}`);
});
exports.default = router;
