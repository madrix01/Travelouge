"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const verifyToken_1 = require("@src/verifyToken");
const initUtil_1 = require("@src/initUtil");
const uuid = require("uuid");
const multer = require("multer");
const fs = require("fs");
const util_1 = require("util");
const redisConnect_1 = require("@src/redisConnect");
const imageUpload_1 = require("@utils/imageUpload");
const urlString_1 = require("@utils/urlString");
const unlinkAsync = (0, util_1.promisify)(fs.unlink);
const router = express.Router();
const storage = multer.diskStorage({
    destination: "./public/uploads",
    filename: (req, file, cb) => {
        cb(null, uuid.v4() + "." + file.originalname.split(".").pop());
    },
});
const postMiddleware = {
    imageUpload: multer({ storage: storage }).single("postImage"),
    userVerify: verifyToken_1.default,
};
router.get("/", async (req, res) => {
    res.json({ page: "post" });
});
router.post("/", [postMiddleware.userVerify, postMiddleware.imageUpload], async (req, res) => {
    const filePath = req.file.path;
    const filename = req.file.filename;
    const publicId = "posts";
    const body = req.body;
    const cdn_url = process.env.CDN_URL;
    const postBody = {
        postId: uuid.v4(),
        timeCreate: BigInt(Date.now()),
        userId: req.user.id,
        title: body.title,
        description: body.description,
        imageURL: cdn_url + req.file.filename,
        latitude: Number(body.latitude),
        longitude: Number(body.longitude),
        commentCount: 0,
        likesCount: 0,
        postUrl: (0, urlString_1.default)(body.title),
    };
    await (0, imageUpload_1.default)({ filePath, filename, publicId }).catch((err) => console.log(err));
    // Clear cache
    await (0, redisConnect_1.DEL_ASYNC)(`mpost ${req.user.username}`);
    await initUtil_1.default.post.create({
        data: postBody,
    });
    res.json(postBody);
});
// Get all post of a user
router.get("/:username", verifyToken_1.default, async (req, res) => {
    const cachedData = await (0, redisConnect_1.GET_ASYNC)(`mpost ${req.params.username}`);
    if (cachedData) {
        return res.status(200).json(JSON.parse(cachedData));
    }
    let uid;
    const cachedUser = await (0, redisConnect_1.GET_ASYNC)(`profile ${req.params.username}`);
    if (cachedUser) {
        uid = JSON.parse(cachedUser);
    }
    else if (!cachedData) {
        uid = await initUtil_1.default.user.findFirst({
            where: {
                username: req.params.username,
            },
        });
        await (0, redisConnect_1.SET_ASYNC)(`profile ${req.params.username}`, JSON.stringify(uid), "EX", 1000);
    }
    if (!uid) {
        return res.json({ error: "No user found" });
    }
    const userId = uid.id;
    const userPosts = await initUtil_1.default.post.findMany({
        where: {
            userId: userId,
        },
        orderBy: {
            timeCreate: "desc",
        },
    });
    if (userPosts.length === 0) {
        return res.json({ error: "no posts yet" });
    }
    await (0, redisConnect_1.SET_ASYNC)(`mpost ${req.params.username}`, JSON.stringify(userPosts), "EX", 1000).catch((err) => console.log(err));
    return res.status(200).json(userPosts);
});
// Get specific post
router.get("/id/:postId", verifyToken_1.default, async (req, res) => {
    const cachedPost = await (0, redisConnect_1.GET_ASYNC)(req.params.postId);
    // console.log(cachedPost);
    if (cachedPost) {
        res.json(JSON.parse(cachedPost));
    }
    else if (!cachedPost) {
        const pst = await initUtil_1.default.post.findFirst({
            where: {
                postId: req.params.postId,
            },
        });
        await (0, redisConnect_1.SET_ASYNC)(req.params.postId, JSON.stringify(pst), "EX", 600).then(res.status(200).json(pst));
    }
});
// ### Delete post is just setting active = false
// router.get("/del/:postId", verify, async (req, res) => {
//     const postData = await (await postRef.doc(req.params.postId).get()).data();
//     if (postData.userId === req.user.id) {
//         await postRef.doc(req.params.postId).delete();
//         await imageDelete(req.params.postId);
//         await DEL_ASYNC(`mpost ${req.user.username}`);
//         res.json({ deleted: req.params.postId });
//         return;
//     } else {
//         res.status(400).json({ deleted: "error encountered" });
//         return;
//     }
// });
exports.default = router;
