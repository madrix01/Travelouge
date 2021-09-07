import * as express from "express";
import verify from "@src/verifyToken";
import prisma from "@src/initUtil";
import { GET_ASYNC, SET_ASYNC } from "@src/redisConnect";

const router = express.Router();

router.get("/u/:username", verify, async (req, res) => {
    if (req.user.username === req.params.username) {
        const userProfile = req.user;
        return res.status(200).json(userProfile);
    } else {
        const cached_data = await GET_ASYNC(`profile ${req.params.username}`);
        if (cached_data) {
            return res.status(200).json(JSON.parse(cached_data));
        }

        let userProfile = await prisma.user.findFirst({
            where: {
                username: {
                    equals: req.params.username,
                },
            },
        });
        if (!userProfile) {
            res.status(404).json({ error: "no user found" });
            return;
        }
        userProfile.password = undefined;

        await SET_ASYNC(
            `profile ${req.params.username}`,
            JSON.stringify(userProfile),
            "EX",
            1000
        );
    }
});

router.get("/search", async (req, res) => {
    // const snapShot = await userRef
    //     .where("username", "==", req.query.q)
    //     .get()
    //     .then(async (data) => {
    //         if (data.empty) {
    //             return res.json({ error: "no user found" });
    //         }
    //         const temp = [];
    //         data.forEach((doc) => {
    //             temp.push(doc.data());
    //         });

    //         res.send(temp);
    //     });
    const searchRes = await prisma.user.findFirst({
        where: {
            username: String(req.query.q),
        },
    });
    if (!searchRes) {
        return res.status(404).json({ error: "user not found" });
    }
    res.status(200).json({ username: searchRes.username });
});

export default router;
