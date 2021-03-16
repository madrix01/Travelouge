import * as express from 'express';
const router = express.Router();
import * as fs from 'fs';

import * as AWS from 'aws-sdk';
import * as path from "path";
import * as multer from 'multer';
import {promisify} from 'util';
const unlinkAsync = promisify(fs.unlink);

var storage = multer.diskStorage({
    destination : "./public/uploads",
    filename : (req, file, cb) => {
        cb(null, file.originalname);
    }
})

router.post('/upload', multer({storage : storage}).single('upl') ,async (req, res) => {
    AWS.config.update({region : "us-east-2"});
    var s3 = new AWS.S3({apiVersion : '2006-03-01'});
    console.log(req.body.test);
    
    // const file = 'src\\Routes\\auth.ts';
    
    var file = req.file.path;


    var fileStream = fs.createReadStream(file);
    
    var uploadParams = {
        Bucket: process.env.BUCKET_NAME,
        Key: path.basename(file),
        Body : fileStream,
        ContentType : req.file.mimetype,
        ContentDisposition: 'inline'
    }
    
    const cdn_url = process.env.CDN_URL

    s3.upload(uploadParams, async (err, data) => {
        if(err) {
            console.log(err);
        }else{
            console.log("Upload successfull", "https://" + cdn_url + '/' + req.file.originalname);
            await unlinkAsync(req.file.path)
            res.json({file : file});
        }
    })
})

router.post("/up", multer().single('upl') ,async (req, res) => {
    console.log(req.file);
    res.send("Lool noob");
})


export default router;