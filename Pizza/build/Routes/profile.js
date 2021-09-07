"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const verifyToken_1 = require("@src/verifyToken");
const initUtil_1 = require("@src/initUtil");
const redisConnect_1 = require("@src/redisConnect");
const router = express.Router();
router.get("/u/:username", verifyToken_1.default, async (req, res) => {
    if (req.user.username === req.params.username) {
        const userProfile = req.user;
        return res.status(200).json(userProfile);
    }
    else {
        const cached_data = await (0, redisConnect_1.GET_ASYNC)(`profile ${req.params.username}`);
        if (cached_data) {
            return res.status(200).json(JSON.parse(cached_data));
        }
        let userProfile = await initUtil_1.default.user.findFirst({
            where: {
                username: {
                    equals: req.params.username,
                },
            },
        });
        if (!userProfile) {
            res.status(404).json({ error: "no user found" });
            return;
        }
        userProfile.password = undefined;
        await (0, redisConnect_1.SET_ASYNC)(`profile ${req.params.username}`, JSON.stringify(userProfile), "EX", 1000);
    }
});
router.get("/search", async (req, res) => {
    // const snapShot = await userRef
    //     .where("username", "==", req.query.q)
    //     .get()
    //     .then(async (data) => {
    //         if (data.empty) {
    //             return res.json({ error: "no user found" });
    //         }
    //         const temp = [];
    //         data.forEach((doc) => {
    //             temp.push(doc.data());
    //         });
    //         res.send(temp);
    //     });
    const searchRes = await initUtil_1.default.user.findFirst({
        where: {
            username: String(req.query.q),
        },
    });
    if (!searchRes) {
        return res.status(404).json({ error: "user not found" });
    }
    res.status(200).json({ username: searchRes.username });
});
exports.default = router;
