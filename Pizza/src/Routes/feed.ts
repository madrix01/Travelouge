import * as express from 'express';
import db from '@src/initFirebase'
import {GET_ASYNC, SET_ASYNC} from '@src/redisConnect';
import verify from '@src/verifyToken';


const postRef = db.collection("posts");
const router = express.Router();


router.get('/', async (req, res) => {
    res.json({page : "feed"})
})

// My feed
router.get('/')

export default router;
