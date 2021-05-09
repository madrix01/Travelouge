"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AWS = require("aws-sdk");
const fs = require("fs");
const path = require("path");
const imageCompress_1 = require("./imageCompress");
const util_1 = require("util");
const unlinkAsync = util_1.promisify(fs.unlink);
const imageUpload = async ({ filePath, filename, mimetype }) => {
    AWS.config.update({ region: "us-east-2" });
    var s3 = new AWS.S3({ apiVersion: '2006-03-01' });
    var fileStream = fs.createReadStream(filePath);
    var optimizedFilePath = 'public/optimized/' + filename;
    await imageCompress_1.default();
    const optimizedFs = await fs.createReadStream(optimizedFilePath);
    const imageUploadParams = {
        Bucket: process.env.BUCKET_NAME,
        Key: path.basename(filename),
        Body: optimizedFs,
        ContentType: mimetype,
        ContentDisposition: 'inline'
    };
    const cdn_url = process.env.CDN_URL;
    s3.upload(imageUploadParams, async (err, data) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log(cdn_url + filename);
            return 1;
        }
    });
    // await unlinkAsync(filePath).catch(err => console.log(err));
    // await unlinkAsync(optimizedFilePath).catch(err=> console.log(err));
};
exports.default = imageUpload;
