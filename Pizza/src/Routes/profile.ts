import * as express from 'express';
import verify from '../verifyToken';
import db from '../initFirebase';
import {User} from '../Models/user.model'
import { LakeFormation } from 'aws-sdk';

const userRef = db.collection("users");
const router = express.Router();

router.get('/u/:username',verify ,async (req, res) => {
    console.log(req.params.username);
    if(req.user.username === req.params.username){
        var userProfile = req.user; 
        res.json(userProfile);
    }else{
        const snapShot = await userRef.where('username', "==", req.params.username).get();
        if(snapShot.empty){
            res.json({'error' : 'no user found'});
            return;
        }
        
        snapShot.forEach(doc => {
            const userProfile = doc.data();
            userProfile.password = undefined;
            res.send(userProfile);
        })
    }   
})


export default router;