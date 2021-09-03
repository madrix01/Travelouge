import * as jwt from 'jsonwebtoken'   
import {Request, Response, NextFunction} from 'express';

export default (req : Request, res : Response, next : NextFunction) : void => {
    const token : string = req.header('authToken')
    if(!token) res.status(400).json({"error" : "Access Denied"});

    try{
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        next();
    }catch(err){
        res.status(400).json({error : "invalid token"})
    }
}