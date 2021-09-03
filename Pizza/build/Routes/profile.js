"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const verifyToken_1 = require("@src/verifyToken");
const initFirebase_1 = require("@src/initFirebase");
const redisConnect_1 = require("@src/redisConnect");
const userRef = initFirebase_1.default.collection("users");
const router = express.Router();
router.get('/u/:username', verifyToken_1.default, async (req, res) => {
    if (req.user.username === req.params.username) {
        const userProfile = req.user;
        return res.json(userProfile);
    }
    else {
        const cached_data = await (0, redisConnect_1.GET_ASYNC)(`profile ${req.params.username}`);
        if (cached_data) {
            res.json(JSON.parse(cached_data));
            return;
        }
        const snapShot = await userRef.where('username', "==", req.params.username).get();
        if (snapShot.empty) {
            res.status(404).json({ 'error': 'no user found' });
            return;
        }
        snapShot.forEach(async (doc) => {
            const userProfile = doc.data();
            userProfile.password = undefined;
            await (0, redisConnect_1.SET_ASYNC)(`profile ${req.params.username}`, JSON.stringify(userProfile), 'EX', 3600);
            res.json(userProfile);
            return;
        });
    }
});
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
exports.default = router;
