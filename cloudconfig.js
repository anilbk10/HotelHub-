const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const dotenv = require('dotenv');

// Load environment variables from .env file if available
dotenv.config();
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

// Set up Cloudinary storage with specific parameters
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'HotelHub_dev', // Folder where images will be stored in Cloudinary
        allowed_formats: ["png", "jpg", "jpeg"], 
    },
});


module.exports = {
    cloudinary,
    storage
};
