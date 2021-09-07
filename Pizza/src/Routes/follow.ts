import * as express from "express";
import verify from "../verifyToken";
const router = express.Router();
import prisma from "../initUtil";
import { Follow } from "@models/follow.model";
import * as uuid from "uuid";
import { SET_ASYNC } from "@src/redisConnect";

router.get("/follow/:followId", verify, async (req, res) => {
    if (req.user.id === req.params.followId) {
        return res.json({ error: "cannot follow logged in user" });
    }

    // Check if user is present
    let destiUser = await prisma.user.findFirst({
        where: {
            id: req.params.followId,
        },
    });

    if (!destiUser) {
        return res.status(404).json({ error: "destination user not found" });
    }

    const yd = await prisma.followRelations.findFirst({
        where: {
            fsource: {
                equals: req.user.id,
            },
            fdesti: {
                equals: req.params.followId,
            },
        },
    });

    if (yd) {
        if (yd.isActive) {
            return res.status(400).json({ error: "already followed" });
        } else {
            await prisma.followRelations.update({
                where: {
                    relationId: yd.relationId,
                },
                data: {
                    isActive: true,
                },
            });
        }
    } else {
        const followRelation: Follow = {
            fdesti: req.params.followId,
            fsource: req.user.id,
            relationId: uuid.v4(),
            time: Date.now(),
            isActive: true,
        };

        await prisma.followRelations.create({
            data: followRelation,
        });
    }

    // increase following count
    let sourceUser = await prisma.user.update({
        where: {
            id: req.user.id,
        },
        data: {
            followings: {
                increment: 1,
            },
        },
    });

    // increase follower count
    destiUser = await prisma.user.update({
        where: {
            id: req.params.followId,
        },
        data: {
            followers: {
                increment: 1,
            },
        },
    });

    // Updating cache
    // Updating source user
    await SET_ASYNC(
        `profile ${sourceUser.username}`,
        JSON.stringify(sourceUser),
        "EX",
        3600
    );

    // Updating destination user
    await SET_ASYNC(
        `profile ${destiUser.username}`,
        JSON.stringify(destiUser),
        "EX",
        3600
    );

    return res.status(200).json({ success: "follow relation created" });
});

router.get("/unfollow/:followId", verify, async (req, res) => {
    if (req.user.id === req.params.followId) {
        return res.json({ error: "cannot unfollow logged in user" });
    }

    const followRelation = await prisma.followRelations.findFirst({
        where: {
            AND: [
                {
                    fsource: {
                        equals: req.user.id,
                    },
                },
                {
                    fdesti: {
                        equals: req.params.followId,
                    },
                },
            ],
        },
    });
    if (!followRelation) {
        return res.status(404).json({ error: "relation not found" });
    }

    if (!followRelation.isActive) {
        return res.status(400).json({ error: "relation is not active" });
    }

    await prisma.followRelations.update({
        where: {
            relationId: followRelation.relationId,
        },
        data: {
            isActive: false,
        },
    });

    // decrease following count
    const sourceUser = await prisma.user.update({
        where: {
            id: req.user.id,
        },
        data: {
            followings: {
                decrement: 1,
            },
        },
    });

    // decrease follower count
    const destiUser = await prisma.user.update({
        where: {
            id: req.params.followId,
        },
        data: {
            followers: {
                decrement: 1,
            },
        },
    });

    // Updating cache
    // Updating source user
    await SET_ASYNC(
        `profile ${sourceUser.username}`,
        JSON.stringify(sourceUser),
        "EX",
        3600
    );

    // Updating destination user
    await SET_ASYNC(
        `profile ${destiUser.username}`,
        JSON.stringify(destiUser),
        "EX",
        3600
    );

    res.json({ deactivated: "yes" });
});

export default router;
