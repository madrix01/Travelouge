"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const verifyToken_1 = require("../verifyToken");
const router = express.Router();
const initFirebase_1 = require("../initFirebase");
const uuid = require("uuid");
const firebase_admin_1 = require("firebase-admin");
const redisConnect_1 = require("@src/redisConnect");
const userRef = initFirebase_1.default.collection('users');
const followRef = initFirebase_1.default.collection('followRelations');
router.get("/follow/:followId", verifyToken_1.default, async (req, res) => {
    if (req.user.id === req.params.followId) {
        res.json({ error: "cannot follow logged in user" });
    }
    const yd = await followRef.where('fsource', '==', req.user.id).get().then((ss) => {
        const temp = [];
        ss.forEach((doc) => {
            temp.push(doc.data());
        });
        return temp;
    });
    if (yd.length != 0) {
        for (const doc of yd) {
            if (doc.fdesti === req.params.followId) {
                console.log("Already following");
                return res.status(400).json({ "error": "already followed" });
            }
        }
    }
    const followRelation = {
        fdesti: req.params.followId,
        fsource: req.user.id,
        relationId: uuid.v4(),
        time: Date.now(),
    };
    await followRef.doc(followRelation.relationId).set(followRelation)
        .catch(err => { res.send(err); });
    // increase following
    await userRef.doc(req.user.id).update({
        followings: firebase_admin_1.firestore.FieldValue.increment(1)
    });
    await userRef.doc(req.params.followId).update({
        followers: firebase_admin_1.firestore.FieldValue.increment(1)
    });
    // Updating cache 
    await userRef.doc(req.user.id).get()
        .then(doc => {
        if (doc.exists) {
            (0, redisConnect_1.SET_ASYNC)(`profile ${doc.data().username}`, JSON.stringify(doc.data()), "EX", 3600);
        }
    });
    await userRef.doc(req.params.followId).get()
        .then(doc => {
        if (doc.exists) {
            (0, redisConnect_1.SET_ASYNC)(`profile ${doc.data().username}`, JSON.stringify(doc.data()), "EX", 3600);
        }
    });
    return res.send(followRelation);
});
router.get("/unfollow/:relationId", verifyToken_1.default, async (req, res) => {
    if (req.user.id === req.params.followId) {
        res.json({ error: "cannot follow logged in user" });
    }
    const relationRef = await followRef.doc(req.params.relationId);
    const fr = await relationRef.get();
    if (fr.exists) {
        console.log("Relation Doc", fr.data());
    }
    await followRef.doc(req.params.relationId).delete();
    await userRef.doc(req.user.id).update({
        followings: firebase_admin_1.firestore.FieldValue.increment(-1)
    });
    await userRef.doc(fr.data().following).update({
        followers: firebase_admin_1.firestore.FieldValue.increment(-1)
    });
    res.json({ "deleted": "yes" });
});
exports.default = router;
