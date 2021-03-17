import * as express from 'express';
const router = express.Router();
import db from '../initFirebase';
import * as bycrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import {LoginUser, NewUser} from '../Models/user.model'
import * as uuid from 'uuid';

const userRef = db.collection('users');    

router.get('/register', async (req, res) => {
    res.json({page : "register"});
})

router.post('/register', async (req, res) => {


    const body : NewUser = req.body;

    const usernameExsists = await userRef.where("username", "==", req.body.username).get();
    const emailExsists = await userRef.where("email", "==", req.body.email).get();

    if(!usernameExsists.empty || !emailExsists.empty){
        res.status(400).json({error : "Email or username exsists"});
    }else{

        const salt : string = await bycrypt.genSalt(10);
        const hashPass : string = await bycrypt.hash(req.body.password, salt);

        var newUserConfirm : NewUser = {
            username : req.body.username,
            email : req.body.email,
            password : hashPass,
            followers : 0,
            followings : 0,
            placesVisited : 0,
            bio : req.body.bio || "",
            timeCreate : Date.now(),
            id : uuid.v4()
        };

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

            const token = jwt.sign(
                doc.data()
            , process.env.TOKEN_SECRET, {expiresIn: '1d'});
            
            res.cookie('authToken', token, {httpOnly : true});
            res.status(200).json({authToken : token});
        })
    }
})

export default router