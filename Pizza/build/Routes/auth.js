"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bycrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const uuid = require("uuid");
const multer = require("multer");
const aquarelle = require("aquarelle");
const initFirebase_1 = require("../initFirebase");
const imageUpload_1 = require("@utils/imageUpload");
const router = express.Router();
const userRef = initFirebase_1.default.collection('users');
var storage = multer.diskStorage({
    destination: "./public/uploads",
    filename: (req, file, cb) => {
        cb(null, uuid.v4() + '.' + file.originalname.split('.').pop());
    }
});
const postMiddleware = {
    imgUpload: multer({ storage: storage }).single("profilePhoto"),
};
router.get('/register', async (req, res) => {
    res.json({ page: "register" });
});
router.post('/register', postMiddleware.imgUpload, async (req, res) => {
    console.log('Request Recieved');
    if (!req.file) {
        console.info("No image found");
    }
    const body = req.body;
    const cdn_url = process.env.CDN_URL;
    const usernameExsists = await userRef.where("username", "==", req.body.username).get();
    const emailExsists = await userRef.where("email", "==", req.body.email).get();
    if (!usernameExsists.empty || !emailExsists.empty) {
        res.status(400).json({ error: "Email or username exsists" });
    }
    else {
        console.log(req.body.password);
        const password = await req.body.password;
        const salt = await bycrypt.genSalt(10);
        const hashPass = await bycrypt.hash(password, salt);
        let filePath;
        let filename;
        let mimetype;
        if (!req.file) {
            console.log("No file found");
            const genFile = await aquarelle(256, 256, 'public/uploads');
            filePath = genFile.filePath;
            filename = genFile.fileName;
            mimetype = "image/png";
            console.log(filePath, filename, mimetype);
        }
        else {
            console.log("File found");
            filePath = req.file.path;
            filename = req.file.filename;
            mimetype = req.file.mimetype;
        }
        var newUserConfirm = {
            username: body.username,
            email: body.email,
            password: hashPass,
            followers: 0,
            followings: 0,
            placesVisited: 0,
            bio: body.bio || "",
            timeCreate: Date.now(),
            id: uuid.v4(),
            profilePhotoUrl: cdn_url + filename
        };
        await imageUpload_1.default({ filePath, filename, mimetype });
        await userRef.doc(newUserConfirm.id).set(newUserConfirm)
            .then(() => { res.status(200).json(newUserConfirm); })
            .catch(err => { res.send(err); });
    }
});
router.post('/login', async (req, res) => {
    const body = req.body;
    const userExsist = await userRef.where("username", "==", body.username).get();
    if (userExsist.empty) {
        res.status(400).json({ 'error': "wrong username or password" });
    }
    else {
        userExsist.forEach(async (doc) => {
            const validPass = await bycrypt.compare(body.password, doc.data().password);
            if (!validPass) {
                res.status(400).json({ 'error': "wrong username or password" });
            }
            let tokenData = doc.data();
            tokenData.password = undefined;
            const token = jwt.sign(tokenData, process.env.TOKEN_SECRET, { expiresIn: '1d' });
            res.cookie('authToken', token, { httpOnly: true });
            res.status(200).json({ authToken: token });
        });
    }
});
exports.default = router;
