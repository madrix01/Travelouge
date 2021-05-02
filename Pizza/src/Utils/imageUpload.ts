import * as AWS from 'aws-sdk';
import * as uuid from 'uuid';
import * as fs from 'fs';
import * as path from 'path';
import imgCompress from './imageCompress';
import { response } from 'express';
import {promisify} from 'util';
import { diskStorage } from 'multer';
const unlinkAsync = promisify(fs.unlink);

const imageUpload = async ({filePath, filename, mimetype})  => {
    AWS.config.update({region : "us-east-2"});
    var s3 = new AWS.S3({apiVersion : '2006-03-01'}); 

    var fileStream = fs.createReadStream(filePath);
    var optimizedFilePath = 'public/optimized/' + filename;
    
    await imgCompress();

    const optimizedFs = await fs.createReadStream(optimizedFilePath);
    const imageUploadParams = {
        Bucket : process.env.BUCKET_NAME,
        Key : path.basename(filename),
        Body : optimizedFs,
        ContentType :  mimetype,
        ContentDisposition : 'inline'
    }

    const cdn_url = process.env.CDN_URL;
    
    s3.upload(imageUploadParams, async (err, data) => {
        if(err) {
            console.log(err);
        }else{
            console.log(cdn_url + filename);
            return 1;
        }
    })

    // await unlinkAsync(filePath).catch(err => console.log(err));
    // await unlinkAsync(optimizedFilePath).catch(err=> console.log(err));
}


export default imageUpload;