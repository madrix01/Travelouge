"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("module-alias/register");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
dotenv.config();
// Routes
const auth_1 = require("@routes/auth");
const home_1 = require("@routes/home");
// import testRoute from '@test/test';
const follow_1 = require("@routes/follow");
const post_1 = require("@routes/post");
const profile_1 = require("@routes/profile");
// import feedRoute from '@routes/feed';
const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
// Routes
app.use("/api/user", auth_1.default);
app.use("/api/home", home_1.default);
app.use("/api", follow_1.default);
app.use("/api/post", post_1.default);
app.use("/api", profile_1.default);
// app.use('/api/feed', feedRoute);
// Test
// app.use('/test', testRoute  );
app.get("/", (req, res) => {
    res.send("Hello");
});
exports.default = app;
