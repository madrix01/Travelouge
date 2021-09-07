"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const router = express.Router();
router.get("/", async (req, res) => {
    res.json({ page: "feed" });
});
// My feed
exports.default = router;
