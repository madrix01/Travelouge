"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const imageCompress_1 = require("./imageCompress");
const cloudinary = require("cloudinary");
async function imageUpload({ filePath, filename, publicId }) {
    const optimizedFilePath = "public/optimized/" + filename;
    await (0, imageCompress_1.default)();
    if (process.env.PRODUCTION === 'true') {
        await cloudinary.v2.uploader.upload(optimizedFilePath, {
            resource_type: "image",
            public_id: `travelouge/${publicId}/${filename.slice(0, -4)}`,
        }, (error, result) => console.log(error, result));
    }
}
exports.default = imageUpload;
