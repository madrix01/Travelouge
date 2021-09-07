import * as cloudinary from 'cloudinary';
import {PrismaClient} from '@prisma/client';

// console.log("👉Storage cnnected");

if(process.env.PRODUCTION === 'true'){
    console.log("Database connected [Production]");
    cloudinary.v2.config({
        cloud_name: process.env.CN_NAME,
        api_key: process.env.CN_API_KEY,
        api_secret : process.env.CN_API_SECRET
    });
    console.log("Storage connected [Production]");        
}
const prisma = new PrismaClient();



export default prisma; 