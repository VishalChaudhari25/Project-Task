import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from './cloudinary.js';

const getUploadMiddleware = (type = 'single', fieldName = 'profile') => {
  const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
      return {
        folder: 'user_uploads',
        allowed_formats: ['jpg', 'png', 'jpeg'],
        transformation: [{ width: 500, height: 500, crop: 'limit' }],
        use_filename: true, // keep the original filename
        timestamp: Math.floor(Date.now() / 1000), // 👈 add fresh timestamp in seconds
      };
    },
  });

  const uploader = multer({ storage });

  if (type === 'array') {
    return uploader.array(fieldName);
  } else if (type === 'fields') {
    return uploader.fields(fieldName); // pass array of field configs
  } else {
    return uploader.single(fieldName); // default
  }
};

export default getUploadMiddleware;
