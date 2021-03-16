import * as express from 'express';
import verify from '../verifyToken';
import db from '../initFirebase';
import * as uuid from 'uuid';
import * as multer from 'multer';
import * as AWS from 'aws-sdk';
import * as fs from 'fs';
import * as path from 'path';
import {Post} from '../Models/post.model';
import {promisify} from 'util';
const unlinkAsync = promisify(fs.unlink);


const router = express.Router();
const postRef = db.collection('posts');


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

    var file = req.file.path;

    var fileStream = fs.createReadStream(file);

    const body = req.body;
    const cdn_url = process.env.CDN_URL
    const imageUploadParams = {
        Bucket : process.env.BUCKET_NAME,
        Key : path.basename(file),
        Body : fileStream,
        ContentType : req.file.mimetype,
        ContentDisposition: 'inline',
    }

    console.log(imageUploadParams);
    
    console.log(req.file);
    

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
    // await postRef.doc()
    // console.log(file.filename);
    s3.upload(imageUploadParams, async (err, data) => {
        if(err) {
            res.status(400).send(err);
        }else{
            console.log("Post upload successful", cdn_url + req.file.filename);
            await unlinkAsync(req.file.path);
        }
    })


    await postRef.doc(postBody.postId).set(postBody)
        .catch(err => res.send(err));
    res.json(postBody); 
})

export default router;