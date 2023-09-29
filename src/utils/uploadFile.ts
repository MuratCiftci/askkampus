
import cloudinary from './cloudinaryConfig';

export const uploadFile = async (file: { path: string; }) => {
    try {
        const result = await cloudinary.uploader.upload(file.path);
        return result.secure_url; // This URL can be used to display the uploaded image.
    } catch (error) {
        console.error('Error uploading file to Cloudinary:', error);
        throw error;
    }
};

