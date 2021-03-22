import * as express from 'express';
const router = express.Router();
import * as fs from 'fs';

import * as AWS from 'aws-sdk';
import * as path from "path";
import * as multer from 'multer';
import {promisify} from 'util';
import * as uuid from 'uuid';
import imgCompress from '@utils/imageCompress'
import imageUpload from '@utils/imageUpload';
const unlinkAsync = promisify(fs.unlink);

var storage = multer.diskStorage({
    destination : "./public/uploads",
    filename : (req, file, cb) => {
        cb(null, uuid.v4() + '.' + file.originalname.split('.').pop());
    }
})

router.post('/upload', multer({storage : storage}).single('upl') ,async (req, res) => {
    // AWS.config.update({region : "us-east-2"});
    // var s3 = new AWS.S3({apiVersion : '2006-03-01'});
    // console.log(req.body.test);
    
    // const file = 'src\\Routes\\auth.ts';
    
    // var file = req.file.path;
    // var optimizedFile = 'public\\optimized\\' + req.file.filename;
    // console.log(file, optimizedFile);
    


    // var fileStream = fs.createReadStream(file);
    // console.log(path.basename(optimizedFile));
    
    // imgCompress();
    
    // var optimizedFs = fs.createReadStream(optimizedFile);
    // var uploadParams = {
    //     Bucket: process.env.BUCKET_NAME,
    //     Key: path.basename(optimizedFile),
    //     Body : optimizedFs,
    //     ContentType : req.file.mimetype,
    //     ContentDisposition: 'inline'
    // }
    
    // console.log(uploadParams);
    let filePath = req.file.path
    let filename = req.file.filename
    let mimetype = req.file.mimetype
    console.log(filePath, filename, mimetype);
    
    await imageUpload({filePath, filename, mimetype})
    res.send("Uploaded")
    // const cdn_url = process.env.CDN_URL

    // s3.upload(uploadParams, async (err, data) => {
    //     if(err) {
    //         console.log(err);
    //     }else{
    //         console.log("Upload successfull", "https://" + cdn_url + '/' + req.file.originalname);
    //         // await unlinkAsync(req.file.path)
    //         res.json({file : file});
    //     }
    // })
})

router.post("/up", multer().single('upl') ,async (req, res) => {
    console.log(req.file);
    res.send("Lool noob");
})


export default router;