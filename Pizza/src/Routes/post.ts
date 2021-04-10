import * as express from 'express';
import verify from '@src/verifyToken';
import db from '@src/initFirebase';
import * as uuid from 'uuid';
import * as multer from 'multer';
import * as AWS from 'aws-sdk';
import * as fs from 'fs';
import {Post} from '@models/post.model';
import {promisify} from 'util';
import {GET_ASYNC, SET_ASYNC, DEL_ASYNC} from '@src/redisConnect'
import imageUpload from '@utils/imageUpload';
const  unlinkAsync = promisify(fs.unlink);



const router = express.Router();
const postRef = db.collection('posts')
const userRef = db.collection('users');


var storage = multer.diskStorage({
    destination : "./public/uploads",
    filename : (req, file, cb) => {
        cb(null, uuid.v4() + '.' + file.originalname.split('.').pop());
    }
})

const postMiddleware = {
    imageUpload : multer({storage : storage}).single('postImage'),
    userVerify : verify
} 


router.get('/', async (req, res) =>{
    res.json({'page' : 'post'});
})


router.post('/', [postMiddleware.userVerify ,postMiddleware.imageUpload] ,async (req, res) => {
    AWS.config.update({region : "us-east-2"});
    var s3 = new AWS.S3({apiVersion : '2006-03-01'});


    var filePath = req.file.path;
    var filename = req.file.filename;
    var mimetype = req.file.mimetype;


    const body = req.body;
    const cdn_url = process.env.CDN_URL
    

    const postBody : Post = {
        postId : uuid.v4(),
        timeCreate : Date.now(),
        userId : req.user.id,
        title : body.title,
        description : body.description,
        imageURL : cdn_url + req.file.filename,
        location : "XX",
        commentCount : 0,
        likesCount : 0,
    }
    await imageUpload({filePath, filename, mimetype})
        .catch(err => console.log(err));

    // Clear cache
    await DEL_ASYNC(`mpost ${req.user.username}`)

    await postRef.doc(postBody.postId).set(postBody)
        .catch(err => res.send(err));
    res.json(postBody); 
})

router.get('/:username',verify , async (req, res) => {
    
    const cachedData = await GET_ASYNC(`mpost ${req.params.username}`)
    if(cachedData) {
        console.log("Cached POsts");
        res.json(JSON.parse(cachedData))
        return;
    }

    let uid;

    // get user id;
    // console.log("[Get user called]");
    
    const cachedUser = await GET_ASYNC(`profile ${req.params.username}`)
    if(cachedUser){
        console.log("[Cached]");
        uid = JSON.parse(cachedUser)
        // console.log("[Cached]", uid);
    }else if(!cachedData){
        console.log("[Non cached]");
        
        uid = await userRef.where("username", "==", req.params.username).get().then(async (data) => {
            if(data.empty){
                return null; 
            }
            const temp = [];
            data.forEach((doc) => {
                temp.push(doc.data());
            })
            await SET_ASYNC(`profile ${req.params.username}`, JSON.stringify(temp[0]), "EX", 1000);
            console.log(`profile ${req.params.username}`);            
            return temp[0];
        })
    }
    
    console.log("[Yd]" ,uid);
    
    if(!uid) {
        return res.json({"error" : "1No posts"})
    }

    const userId = uid.id;
    console.log("[User id]" ,userId);
    debugger;
    const snapShot = await postRef.where("userId", "==", userId).orderBy("timeCreate", "desc").get()
    
    if(snapShot.empty){
        console.log("Here");
        
        res.json({"error" : "no posts yet"})
        return;
    }
    var mfeed = [];
    snapShot.forEach(doc => {
        const dc = doc.data();
        mfeed.push(dc);
    })

    console.log("Mfeed length", mfeed.length);

    await SET_ASYNC(`mpost ${req.params.username}`, JSON.stringify(mfeed), "EX", 1000).catch(err => console.log(err))
    res.json(mfeed);
    return;
})

export default router;  