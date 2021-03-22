import * as express from 'express';
const router = express.Router();
import db from '../initFirebase';
import * as bycrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import {LoginUser, NewUser, TokenUser} from '../Models/user.model'
import * as uuid from 'uuid';
import * as multer from 'multer';
import {promisify} from 'util';
import * as fs from 'fs';
import * as AWS from 'aws-sdk';
const unlinkAsync = promisify(fs.unlink)
import * as path from 'path';

const userRef = db.collection('users');    

var storage = multer.diskStorage({
    destination : "./public/uploads",
    filename : (req, file, cb) => {
        cb(null, uuid.v4() + '.' + file.originalname.split('.').pop());
    }
})

const postMiddleware = {
    imageUpload : multer({storage : storage}).single("profilePhoto"),
}


router.get('/register', async (req, res) => {
    res.json({page : "register"});
})

router.post('/register', postMiddleware.imageUpload ,async (req, res) => {
    console.log('Request Recieved');

    AWS.config.update({region : "us-east-2"});
    var s3 = new AWS.S3({apiVersion : '2006-03-01'});

    var file = req.file.path;
    var fileStream = fs.createReadStream(file);

    const body : NewUser = req.body;
    const cdn_url = process.env.CDN_URL;
    console.log(body);
    
    const imageUploadParams = {
        Bucket : process.env.BUCKET_NAME,
        Key : path.basename(file),
        Body : fileStream,
        ContentType : req.file.mimetype,
        ContentDisposition: 'inline',
    }

    const usernameExsists = await userRef.where("username", "==", req.body.username).get();
    const emailExsists = await userRef.where("email", "==", req.body.email).get();

    if(!usernameExsists.empty || !emailExsists.empty){
        res.status(400).json({error : "Email or username exsists"});
    }else{
        console.log(req.body.password);
        
        const password = await req.body.password
        const salt = await bycrypt.genSalt(10);
        const hashPass = await bycrypt.hash(password, salt);

        var newUserConfirm : NewUser = {
            username : body.username,
            email : body.email,
            password : hashPass,
            followers : 0,
            followings : 0,
            placesVisited : 0,
            bio : body.bio || "",
            timeCreate : Date.now(),
            id : uuid.v4(),
            profilePhotoUrl : cdn_url + req.file.filename
        };

        s3.upload(imageUploadParams, async(err, data) => {
            if(err) {
                res.status(400).send(err);
            }else{
                //pass
            }
        })

        await userRef.doc(newUserConfirm.id).set(newUserConfirm)
        .then(() => {res.json(newUserConfirm)})
        .catch(err => {res.send(err)})
    }
})

router.post('/login', async (req, res) => {
    const body : LoginUser = req.body;

    const userExsist = await userRef.where("username", "==", body.username).get();

    if(userExsist.empty){
        res.status(400).json({'error' : "wrong username or password"});
    }else{
        userExsist.forEach(async (doc) => {
            const validPass : boolean = await bycrypt.compare(body.password, doc.data().password);
            if(!validPass){
                res.status(400).json({'error' : "wrong username or password"});
            }

            let tokenData = doc.data();
            tokenData.password = undefined;
            const token = jwt.sign(
                tokenData
            , process.env.TOKEN_SECRET, {expiresIn: '1d'});
            
            res.cookie('authToken', token, {httpOnly : true});
            res.status(200).json({authToken : token});
        })
    }
})

export default router