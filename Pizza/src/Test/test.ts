import * as express from 'express';
const router = express.Router();
import * as fs from 'fs';
import db from '@src/initFirebase'
import * as multer from 'multer';
import * as uuid from 'uuid';
import verify from '@src/verifyToken';


const userRef = db.collection('users')

router.get('/follow/:userId', verify ,async (req, res) => {
    const followRef = db.collection('testfollow').doc(req.user.id);


    await followRef.collection('followInfo')
    res.send("Follow done")
})

router.post("/up", multer().single('upl') ,async (req, res) => {
    console.log(req.file);
    res.send("Lool noob");
})


export default router;