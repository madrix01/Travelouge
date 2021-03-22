import * as imagemin from 'imagemin';
// import * as imageminMozjpeg from 'imagemin-mozjpeg';
// import * as imageminPngquant from 'imagemin-pngquant';
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');

const imgCompress = async () => {
    console.log('here');
    await imagemin([`public/uploads/*.png`,], {
        destination : 'public/optimized',
        plugins :  [
            imageminPngquant({quality : [0.60, 0.90]}),
            // imageminMozjpeg({quality : [0.60, 0.90]})
        ]
    })
    await imagemin(['public/uploads/*.jpg'], {
        destination : 'public/optimized',
        plugins : [
            imageminMozjpeg({quality : [0.60, 0.90]})
        ]
    })
}

export default imgCompress;