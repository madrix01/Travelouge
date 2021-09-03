"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const imagemin = require("imagemin");
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');
const imgCompress = async () => {
    await imagemin([`public/uploads/*.png`,], {
        destination: 'public/optimized',
        plugins: [
            imageminPngquant({ quality: [0.60, 0.90] }),
            // imageminMozjpeg({quality : [0.60, 0.90]})
        ]
    });
    await imagemin(['public/uploads/*.jpg'], {
        destination: 'public/optimized',
        plugins: [
            imageminMozjpeg({ quality: [0.60, 0.90] })
        ]
    });
};
exports.default = imgCompress;
