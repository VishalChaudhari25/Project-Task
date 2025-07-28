import express from 'express';
import authenticateToken from '../middleware/authmiddleware.js';
// import { login } from '../controllers/authcontroller.js';

import getUploadMiddleware from '../utils/multer.js';
import { uploadProfilePicture } from '../controllers/user.controller.js';


const router = express.Router();



import { validationMiddleware } from '../middleware/validationMiddleware.js';
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  loginUser
} from '../controllers/user.controller.js';
import {
  createUserSchema,
  loginUserSchema,
  updateUserSchema
} from '../validator/user.validator.js';
// import { upload } from '../middleware/uploadMiddleware.js';
import { authorizeRole } from '../middleware/roleMiddleware.js';



import { forgotPassword, resetPassword } from '../controllers/user.controller.js';



router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
// router.post(
//   '/',
//   upload.single('profilePicture'),
//   validationMiddleware(createUserSchema),
//   createUser
// );



router.post(
  '/login',
  validationMiddleware(loginUserSchema),
  loginUser
);

router.post('/upload-profile',
  authenticateToken,
  (req, res, next) => {
    console.log('Invoking getUploadMiddleware...');
    const uploadMiddleware = getUploadMiddleware('single', 'profile');
    uploadMiddleware(req, res, (err) => {
      if (err) {
        console.error(' Multer middleware error:', err);
        return res.status(400).json({ message: 'File upload failed', error: err.message });
      }
      console.log('Upload middleware passed');
      next();
    });
  },
  uploadProfilePicture
);


router.put(
  '/profile',
  authenticateToken,
  validationMiddleware(updateUserSchema),
  updateUser
);

router.get(
  '/',
  authenticateToken,
  authorizeRole('admin'),
  getUsers
);


router.delete(
  '/:id',
  authenticateToken,
  authorizeRole('admin'),
  deleteUser
);

export default router;
