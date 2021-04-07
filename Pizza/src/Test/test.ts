import * as express from 'express';
const router = express.Router();
import * as fs from 'fs';
import db from '@src/initFirebase'
import * as multer from 'multer';
import * as uuid from 'uuid';
import * as aquarelle from 'aquarelle'
import verify from '@src/verifyToken';


const userRef = db.collection('users')

router.get('/follow/:userId', verify ,async (req, res) => {
    const followRef = db.collection('testfollow').doc(req.user.id);


    await followRef.collection('followInfo')
    res.send("Follow done")
})

router.get("/up",async (req, res) => {
    const x = await aquarelle(128, 128, 'public/uploads').then(console.log("Uploaded"))
      res.send(`${x.filePath} ${x.fileName}`)
})


export default router;