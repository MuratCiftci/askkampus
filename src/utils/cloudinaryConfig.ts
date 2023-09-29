// cloudinaryConfig.js
import { v2 as cloudinary } from 'cloudinary';

interface CloudinaryConfig {
    cloud_name: string;
    api_key: string;
    api_secret: string;
}

const config: CloudinaryConfig = {
    cloud_name:  'doit2lcqj',
    api_key: '757244557974913',
    api_secret: 'D_HyK-Tnm9WE27srNTpvUB48Oj4',
};

 
cloudinary.config(config);

export default cloudinary;
