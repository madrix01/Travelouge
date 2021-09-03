import * as imagemin from 'imagemin';
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');

const imgCompress = async () : Promise<void> => {

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