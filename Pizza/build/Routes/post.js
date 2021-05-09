"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const verifyToken_1 = require("@src/verifyToken");
const initFirebase_1 = require("@src/initFirebase");
const uuid = require("uuid");
const multer = require("multer");
const AWS = require("aws-sdk");
const fs = require("fs");
const util_1 = require("util");
const redisConnect_1 = require("@src/redisConnect");
const imageUpload_1 = require("@utils/imageUpload");
const urlString_1 = require("@utils/urlString");
const imageDelete_1 = require("@utils/imageDelete");
const unlinkAsync = util_1.promisify(fs.unlink);
const router = express.Router();
const postRef = initFirebase_1.default.collection('posts');
const userRef = initFirebase_1.default.collection('users');
var storage = multer.diskStorage({
    destination: "./public/uploads",
    filename: (req, file, cb) => {
        cb(null, uuid.v4() + '.' + file.originalname.split('.').pop());
    }
});
const postMiddleware = {
    imageUpload: multer({ storage: storage }).single('postImage'),
    userVerify: verifyToken_1.default
};
router.get('/', async (req, res) => {
    res.json({ 'page': 'post' });
});
router.post('/', [postMiddleware.userVerify, postMiddleware.imageUpload], async (req, res) => {
    AWS.config.update({ region: "us-east-2" });
    var s3 = new AWS.S3({ apiVersion: '2006-03-01' });
    var filePath = req.file.path;
    var filename = req.file.filename;
    var mimetype = req.file.mimetype;
    const body = req.body;
    const cdn_url = process.env.CDN_URL;
    const postBody = {
        postId: uuid.v4(),
        timeCreate: Date.now(),
        userId: req.user.id,
        title: body.title,
        description: body.description,
        imageURL: cdn_url + req.file.filename,
        latitude: Number(body.latitude),
        longitude: Number(body.longitude),
        commentCount: 0,
        likesCount: 0,
        postUrl: urlString_1.default(body.title)
    };
    await imageUpload_1.default({ filePath, filename, mimetype })
        .catch(err => console.log(err));
    // Clear cache
    await redisConnect_1.DEL_ASYNC(`mpost ${req.user.username}`);
    await postRef.doc(postBody.postId).set(postBody)
        .catch(err => res.send(err));
    res.json(postBody);
});
// Get all post of a user
router.get('/:username', verifyToken_1.default, async (req, res) => {
    const cachedData = await redisConnect_1.GET_ASYNC(`mpost ${req.params.username}`);
    if (cachedData) {
        res.json(JSON.parse(cachedData));
        return;
    }
    let uid;
    const cachedUser = await redisConnect_1.GET_ASYNC(`profile ${req.params.username}`);
    if (cachedUser) {
        uid = JSON.parse(cachedUser);
    }
    else if (!cachedData) {
        uid = await userRef.where("username", "==", req.params.username).get().then(async (data) => {
            if (data.empty) {
                return null;
            }
            const temp = [];
            data.forEach((doc) => {
                temp.push(doc.data());
            });
            await redisConnect_1.SET_ASYNC(`profile ${req.params.username}`, JSON.stringify(temp[0]), "EX", 1000);
            return temp[0];
        });
    }
    if (!uid) {
        return res.json({ "error": "1No posts" });
    }
    const userId = uid.id;
    const snapShot = await postRef.where("userId", "==", userId).orderBy("timeCreate", "desc").get();
    if (snapShot.empty) {
        res.json({ "error": "no posts yet" });
        return;
    }
    var mfeed = [];
    snapShot.forEach(doc => {
        const dc = doc.data();
        mfeed.push(dc);
    });
    await redisConnect_1.SET_ASYNC(`mpost ${req.params.username}`, JSON.stringify(mfeed), "EX", 1000).catch(err => console.log(err));
    res.json(mfeed);
    return;
});
// Get specific post 
router.get("/id/:postId", verifyToken_1.default, async (req, res) => {
    const cachedPost = await redisConnect_1.GET_ASYNC(req.params.postId);
    // console.log(cachedPost);
    if (cachedPost) {
        res.json(JSON.parse(cachedPost));
    }
    else if (!cachedPost) {
        const pst = await postRef.doc(req.params.postId).get();
        await redisConnect_1.SET_ASYNC(req.params.postId, JSON.stringify(pst.data()), 'EX', 600).then(res.json(pst.data()));
    }
});
router.get("/del/:postId", verifyToken_1.default, async (req, res) => {
    const postData = await (await postRef.doc(req.params.postId).get()).data();
    if (postData.userId === req.user.id) {
        await postRef.doc(req.params.postId).delete();
        await imageDelete_1.default(req.params.postId);
        await redisConnect_1.DEL_ASYNC(`mpost ${req.user.username}`);
        res.json({ "deleted": req.params.postId });
        return;
    }
    else {
        res.status(400).json({ "deleted": "error encountered" });
        return;
    }
});
exports.default = router;
