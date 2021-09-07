"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bycrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const uuid = require("uuid");
const multer = require("multer");
const aquarelle = require("aquarelle");
const initUtil_1 = require("../initUtil");
const imageUpload_1 = require("@utils/imageUpload");
const router = express.Router();
const storage = multer.diskStorage({
    destination: process.env.PRODUCTION === "true"
        ? "./public/uploads"
        : "../fries/src/cloudLocal/userProfile",
    filename: (req, file, cb) => {
        cb(null, uuid.v4() + "." + file.originalname.split(".").pop());
    },
});
const postMiddleware = {
    imgUpload: multer({ storage: storage }).single("profilePhoto"),
};
router.get("/register", async (req, res) => {
    res.json({ page: "register" });
});
router.post("/register", postMiddleware.imgUpload, async (req, res) => {
    const dpUploadPath = process.env.PRODUCTION === "true"
        ? "public/uploads"
        : "/fries/src/cloudLocal/userProfile";
    if (!req.file) {
        console.info("No image found");
    }
    const body = req.body;
    const cdn_url = process.env.PRODUCTION === "true"
        ? process.env.CDN_URL
        : process.env.LOCAL_URL;
    const usernameExsists = await initUtil_1.default.user.findMany({
        where: {
            username: {
                equals: req.body.username,
            },
        },
    });
    const emailExsists = await initUtil_1.default.user.findMany({
        where: {
            email: {
                equals: req.body.email,
            },
        },
    });
    if (usernameExsists.length > 0 || emailExsists.length > 0) {
        res.status(400).json({ error: "Email or username exsists" });
    }
    else {
        const password = await req.body.password;
        const salt = await bycrypt.genSalt(10);
        const hashPass = await bycrypt.hash(password, salt);
        let filePath;
        let filename;
        const publicId = "userProfile";
        if (!req.file) {
            const genFile = await aquarelle(256, 256, "../fries/src/cloudLocal/userProfile");
            filePath = genFile.filePath;
            filename = genFile.fileName;
        }
        else {
            filePath = req.file.path;
            filename = req.file.filename;
        }
        const newUserConfirm = {
            username: body.username,
            email: body.email,
            password: hashPass,
            followers: 0,
            followings: 0,
            placesVisited: 0,
            bio: body.bio || "",
            timeCreate: Date.now(),
            id: uuid.v4(),
            profilePhotoUrl: cdn_url + `/${publicId}/${filename}`,
        };
        await (0, imageUpload_1.default)({ filePath, filename, publicId });
        const newUser = await initUtil_1.default.user
            .create({
            data: newUserConfirm,
        })
            .then(() => {
            return res
                .status(200)
                .json({
                username: newUserConfirm.username,
                email: newUserConfirm.email,
            });
        })
            .catch((err) => console.log(err));
    }
});
router.post("/login", async (req, res) => {
    if (!req.body) {
        return res.json({ error: "not adequate parameters" });
    }
    const body = req.body;
    // const userExsist = await userRef.where("username", "==", body.username).get();
    const userExsist = await initUtil_1.default.user.findFirst({
        where: {
            username: {
                equals: body.username,
            },
        },
    });
    if (!userExsist) {
        res.status(400).json({ error: "wrong username or password" });
    }
    else {
        const validPass = await bycrypt.compare(body.password, userExsist.password);
        if (!validPass) {
            res.json({ error: "wrong username or password" });
            return;
        }
        const tokenData = userExsist;
        tokenData.password = undefined;
        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET, {
            expiresIn: "1d",
        });
        res.cookie("authToken", token, { httpOnly: true });
        res.status(200).json({ authToken: token });
        return;
    }
});
router.get("/authtest", async (req, res) => {
    await initUtil_1.default.test.create({
        data: {
            id: "234",
            username: "madrix01",
        },
    });
    res.send("Working");
});
exports.default = router;
