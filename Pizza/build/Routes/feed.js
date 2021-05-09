"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const initFirebase_1 = require("@src/initFirebase");
const postRef = initFirebase_1.default.collection("posts");
const router = express.Router();
router.get('/', async (req, res) => {
    res.json({ page: "feed" });
});
// My feed
exports.default = router;
