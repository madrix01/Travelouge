import * as express from 'express';
import verify from '@src/verifyToken';
import db from '@src/initFirebase';
import {GET_ASYNC, SET_ASYNC} from '@src/redisConnect';

const userRef = db.collection("users");
const router = express.Router();


router.get('/u/:username',verify ,async (req, res) => {
    if(req.user.username === req.params.username){
        var userProfile = req.user; 
        return res.json(userProfile);
    }else{
        const cached_data = await GET_ASYNC(`profile ${req.params.username}`);
        if(cached_data){
            res.json(JSON.parse(cached_data));
            return;
        }
        const snapShot = await userRef.where('username', "==", req.params.username).get();
        if(snapShot.empty){
            res.status(404).json({'error' : 'no user found'});
            return;
        }
        snapShot.forEach(async doc =>  {
            var userProfile = doc.data();
            userProfile.password = undefined;
            await SET_ASYNC(`profile ${req.params.username}`, JSON.stringify(userProfile), 'EX', 3600)
            res.json(userProfile)
            return;
        })
    }
})

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


export default router;
