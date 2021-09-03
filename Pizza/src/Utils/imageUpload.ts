import imgCompress from "./imageCompress";
import * as cloudinary from "cloudinary";

interface imageUploadParameters{
    filePath : string,
    filename : string,
    publicId : string,
}

async function imageUpload({ filePath , filename, publicId } : imageUploadParameters) : Promise<void> {    
    const optimizedFilePath = "public/optimized/" + filename;
    await imgCompress();
    
    if(process.env.PRODUCTION === 'true'){
        await cloudinary.v2.uploader.upload( optimizedFilePath, {
            resource_type: "image",
            public_id: `travelouge/${publicId}/${filename.slice(0, -4)}`,
            }, (error, result) => console.log(error, result)
        );
    }
}
export default imageUpload;