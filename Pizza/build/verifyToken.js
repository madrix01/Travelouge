"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require("jsonwebtoken");
exports.default = (req, res, next) => {
    const token = req.header("authToken");
    if (!token)
        res.status(400).json({ error: "Access Denied" });
    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        next();
    }
    catch (err) {
        return res.status(400).json({ error: "invalid token" });
    }
};
