"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AWS = require("aws-sdk");
const imageDelete = async (imgUrl) => {
    AWS.config.update({ region: "us-east-2" });
    var s3 = new AWS.S3({ apiVersion: '2006-03-01' });
    const imgId = imgUrl.split('/').pop();
    const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: imgId
    };
    s3.deleteObject(params, function (err, data) {
        if (err)
            console.log(err, err.stack);
    });
};
exports.default = imageDelete;
