import * as express from 'express';
import * as bycrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import * as uuid from 'uuid';
import * as multer from 'multer';
import * as aquarelle from 'aquarelle';
import db from '../initFirebase';
import {LoginUser, NewUser} from '@models/user.model'
import imageUpload from '@utils/imageUpload'


const router = express.Router();

const userRef = db.collection('users');    

const storage = multer.diskStorage({
    destination : (process.env.PRODUCTION === "true"? "./public/uploads" : "../fries/src/cloudLocal/userProfile"),
    filename : (req, file, cb) => {
        cb(null, uuid.v4() + '.' + file.originalname.split('.').pop());
    }
})

const postMiddleware = {
    imgUpload : multer({storage : storage}).single("profilePhoto"),
}


router.get('/register', async (req, res) => {
    res.json({page : "register"});
})

router.post('/register', postMiddleware.imgUpload ,async (req, res) => {

    const dpUploadPath = process.env.PRODUCTION === "true" ? "public/uploads" : "/fries/src/cloudLocal/userProfile"

    if(!req.file){
        console.info("No image found");
    }

    const body : NewUser = req.body;
    const cdn_url = process.env.PRODUCTION === 'true' ? process.env.CDN_URL : process.env.LOCAL_URL;

    const usernameExsists = await userRef.where("username", "==", req.body.username).get();
    const emailExsists = await userRef.where("email", "==", req.body.email).get();

    if(!usernameExsists.empty || !emailExsists.empty){
        res.status(400).json({error : "Email or username exsists"});
    }else{
        console.log(req.body.password);
        
        const password = await req.body.password
        const salt = await bycrypt.genSalt(10);
        const hashPass = await bycrypt.hash(password, salt);

        
        
        let filePath : string
        let filename : string
        const publicId : string = "userProfile";
        
        if(!req.file){ 
            const genFile = await aquarelle(256, 256, "../fries/src/cloudLocal/userProfile");
            filePath = genFile.filePath
            filename = genFile.fileName
        }else{ 
            filePath = req.file.path;
            filename = req.file.filename;
        }

        const newUserConfirm : NewUser = {
            username : body.username,
            email : body.email,
            password : hashPass,
            followers : 0,
            followings : 0,
            placesVisited : 0,
            bio : body.bio || "",
            timeCreate : Date.now(),
            id : uuid.v4(),
            profilePhotoUrl : cdn_url + `/${publicId}/${filename}`
        };
        
        await imageUpload({filePath, filename, publicId})

        await userRef.doc(newUserConfirm.id).set(newUserConfirm)
        .then(() => {res.status(200).json(newUserConfirm)})
        .catch(err => res.send(err))
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

            const tokenData = doc.data();
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