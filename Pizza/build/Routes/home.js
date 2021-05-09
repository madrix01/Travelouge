"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const router = express.Router();
const verifyToken_1 = require("../verifyToken");
router.get('/', verifyToken_1.default, async (req, res) => {
    res.json(req.user);
});
exports.default = router;
