"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const verifyToken_1 = require("../verifyToken");
const router = express.Router();
const initUtil_1 = require("../initUtil");
const uuid = require("uuid");
const redisConnect_1 = require("@src/redisConnect");
router.get("/follow/:followId", verifyToken_1.default, async (req, res) => {
    if (req.user.id === req.params.followId) {
        return res.json({ error: "cannot follow logged in user" });
    }
    // Check if user is present
    let destiUser = await initUtil_1.default.user.findFirst({
        where: {
            id: req.params.followId,
        },
    });
    if (!destiUser) {
        return res.status(404).json({ error: "destination user not found" });
    }
    const yd = await initUtil_1.default.followRelations.findFirst({
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
        }
        else {
            await initUtil_1.default.followRelations.update({
                where: {
                    relationId: yd.relationId,
                },
                data: {
                    isActive: true,
                },
            });
        }
    }
    else {
        const followRelation = {
            fdesti: req.params.followId,
            fsource: req.user.id,
            relationId: uuid.v4(),
            time: Date.now(),
            isActive: true,
        };
        await initUtil_1.default.followRelations.create({
            data: followRelation,
        });
    }
    // increase following count
    let sourceUser = await initUtil_1.default.user.update({
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
    destiUser = await initUtil_1.default.user.update({
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
    await (0, redisConnect_1.SET_ASYNC)(`profile ${sourceUser.username}`, JSON.stringify(sourceUser), "EX", 3600);
    // Updating destination user
    await (0, redisConnect_1.SET_ASYNC)(`profile ${destiUser.username}`, JSON.stringify(destiUser), "EX", 3600);
    return res.status(200).json({ success: "follow relation created" });
});
router.get("/unfollow/:followId", verifyToken_1.default, async (req, res) => {
    if (req.user.id === req.params.followId) {
        return res.json({ error: "cannot unfollow logged in user" });
    }
    const followRelation = await initUtil_1.default.followRelations.findFirst({
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
    await initUtil_1.default.followRelations.update({
        where: {
            relationId: followRelation.relationId,
        },
        data: {
            isActive: false,
        },
    });
    // decrease following count
    const sourceUser = await initUtil_1.default.user.update({
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
    const destiUser = await initUtil_1.default.user.update({
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
    await (0, redisConnect_1.SET_ASYNC)(`profile ${sourceUser.username}`, JSON.stringify(sourceUser), "EX", 3600);
    // Updating destination user
    await (0, redisConnect_1.SET_ASYNC)(`profile ${destiUser.username}`, JSON.stringify(destiUser), "EX", 3600);
    res.json({ deactivated: "yes" });
});
exports.default = router;
