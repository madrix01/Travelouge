import * as express from 'express';
const router = express.Router();
import * as fs from 'fs';
import db from '@src/initFirebase'
import * as multer from 'multer';
import * as uuid from 'uuid';
import * as aquarelle from 'aquarelle'
import verify from '@src/verifyToken';
import * as cloudinary from 'cloudinary';

const userRef = db.collection('users')

router.get('/search' ,async (req, res) => {
    const snapShot = await userRef.where("username", "==", req.query.q).get().then(
        async (data) => {
            if(data.empty){
                return res.json({"error" : "no user found"});
            }
            const temp = [];
            data.forEach((doc) => {
                temp.push(doc.data());
            })

            res.send(temp);
        }
    )
    res.send(req.query.searchq);
})

router.get("/up",async (req, res) => {
    const x = await aquarelle(128, 128, 'public/uploads').then(console.log("Uploaded"))
    res.send(`${x.filePath} ${x.fileName}`)
})

router.get("/", async (req, res) => {
    res.send("mike testing");
})

export default router;