import * as express from "express";
import * as bycrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import * as uuid from "uuid";
import * as multer from "multer";
import * as aquarelle from "aquarelle";
import prisma from "../initUtil";
import { LoginUser, NewUser } from "@models/user.model";
import imageUpload from "@utils/imageUpload";

const router = express.Router();

const storage = multer.diskStorage({
    destination:
        process.env.PRODUCTION === "true"
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
    const dpUploadPath =
        process.env.PRODUCTION === "true"
            ? "public/uploads"
            : "/fries/src/cloudLocal/userProfile";

    if (!req.file) {
        console.info("No image found");
    }

    const body: NewUser = req.body;
    const cdn_url =
        process.env.PRODUCTION === "true"
            ? process.env.CDN_URL
            : process.env.LOCAL_URL;

    const usernameExsists = await prisma.user.findMany({
        where: {
            username: {
                equals: req.body.username,
            },
        },
    });
    const emailExsists = await prisma.user.findMany({
        where: {
            email: {
                equals: req.body.email,
            },
        },
    });

    if (usernameExsists.length > 0 || emailExsists.length > 0) {
        res.status(400).json({ error: "Email or username exsists" });
    } else {
        const password = await req.body.password;
        const salt = await bycrypt.genSalt(10);
        const hashPass = await bycrypt.hash(password, salt);

        let filePath: string;
        let filename: string;
        const publicId: string = "userProfile";

        if (!req.file) {
            const genFile = await aquarelle(
                256,
                256,
                "../fries/src/cloudLocal/userProfile"
            );
            filePath = genFile.filePath;
            filename = genFile.fileName;
        } else {
            filePath = req.file.path;
            filename = req.file.filename;
        }

        const newUserConfirm: NewUser = {
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

        await imageUpload({ filePath, filename, publicId });

        const newUser = await prisma.user
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

    const body: LoginUser = req.body;
    // const userExsist = await userRef.where("username", "==", body.username).get();
    const userExsist = await prisma.user.findFirst({
        where: {
            username: {
                equals: body.username,
            },
        },
    });
    if (!userExsist) {
        res.status(400).json({ error: "wrong username or password" });
    } else {
        const validPass: boolean = await bycrypt.compare(
            body.password,
            userExsist.password
        );
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
    await prisma.test.create({
        data: {
            id: "234",
            username: "madrix01",
        },
    });
    res.send("Working");
});

export default router;
