import * as express from "express";
import prisma from "@src/initUtil";
import { GET_ASYNC, SET_ASYNC } from "@src/redisConnect";
import verify from "@src/verifyToken";

const router = express.Router();

router.get("/", async (req, res) => {
    res.json({ page: "feed" });
});

// My feed

export default router;
