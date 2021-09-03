import * as express from 'express';
import verify from '@src/verifyToken';
import db from '@src/initFirebase';
import * as uuid from 'uuid';
import * as multer from 'multer';
import * as fs from 'fs';
import {Post} from '@models/post.model';
import {promisify} from 'util';
import {GET_ASYNC, SET_ASYNC, DEL_ASYNC} from '@src/redisConnect'
import imageUpload from '@utils/imageUpload';
import strUrl from '@utils/urlString';
import imageDelete from '@utils/imageDelete'
const  unlinkAsync = promisify(fs.unlink);



const router = express.Router();
const postRef = db.collection('posts')
const userRef = db.collection('users');

const storage = multer.diskStorage({
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
    const filePath = req.file.path;
    const filename = req.file.filename;
    const publicId = "posts";


    const body = req.body;
    const cdn_url = process.env.CDN_URL


    const postBody : Post = {
        postId : uuid.v4(),
        timeCreate : Date.now(),
        userId : req.user.id,
        title : body.title,
        description : body.description,
        imageURL : cdn_url + req.file.filename,
        latitude : Number(body.latitude),
        longitude : Number(body.longitude),
        commentCount : 0,
        likesCount : 0,
        postUrl : strUrl(body.title)
    }
    await imageUpload({filePath, filename, publicId})
        .catch(err => console.log(err));

    // Clear cache
    await DEL_ASYNC(`mpost ${req.user.username}`)
    await postRef.doc(postBody.postId).set(postBody)
        .catch(err => res.send(err));
    res.json(postBody); 
})



// Get all post of a user
router.get('/:username',verify , async (req, res) => {
    
    const cachedData = await GET_ASYNC(`mpost ${req.params.username}`)
    if(cachedData) {
        res.json(JSON.parse(cachedData))
        return;
    }

    let uid;    
    const cachedUser = await GET_ASYNC(`profile ${req.params.username}`)
    if(cachedUser){
        uid = JSON.parse(cachedUser)
    }else if(!cachedData){        
        uid = await userRef.where("username", "==", req.params.username).get().then(async (data) => {
            if(data.empty){
                return null; 
            }
            const temp = [];
            data.forEach((doc) => {
                temp.push(doc.data());
            })
            await SET_ASYNC(`profile ${req.params.username}`, JSON.stringify(temp[0]), "EX", 1000);
            return temp[0];
        })
    }
    
    if(!uid) {
        return res.json({"error" : "1No posts"})
    }

    const userId = uid.id;
    const snapShot = await postRef.where("userId", "==", userId).orderBy("timeCreate", "desc").get()
    
    if(snapShot.empty){        
        res.json({"error" : "no posts yet"})
        return;
    }
    const mfeed = [];
    snapShot.forEach(doc => {
        const dc = doc.data();
        mfeed.push(dc);
    })

    await SET_ASYNC(`mpost ${req.params.username}`, JSON.stringify(mfeed), "EX", 1000).catch(err => console.log(err))
    res.json(mfeed);
    return;
})

// Get specific post 

router.get("/id/:postId", verify, async (req, res) => {
    const cachedPost = await GET_ASYNC(req.params.postId)
    // console.log(cachedPost);
    if(cachedPost){
        res.json(JSON.parse(cachedPost));
    }else if(!cachedPost){
        const pst = await postRef.doc(req.params.postId).get()
        await SET_ASYNC(req.params.postId, JSON.stringify(pst.data()), 'EX', 600).then(
            res.json(pst.data())
        );
    }
})


router.get("/del/:postId", verify, async (req,res) => {
    
    const postData = await (await postRef.doc(req.params.postId).get()).data();

    if(postData.userId === req.user.id){
        await postRef.doc(req.params.postId).delete();
        await imageDelete(req.params.postId);
        await DEL_ASYNC(`mpost ${req.user.username}`);
        res.json({"deleted" : req.params.postId});
        return;
    }else{
        res.status(400).json({"deleted" : "error encountered"})
        return;
    }
})


export default router;  