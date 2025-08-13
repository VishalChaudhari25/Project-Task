// import express from 'express';
// import authenticateToken from '../middleware/authmiddleware.js';
// // import { login } from '../controllers/authcontroller.js';
// import getUploadMiddleware from '../utils/multer.js';
// import { uploadProfilePicture } from '../controllers/user.controller.js';
// import { getPostsByUser } from '../controllers/post.controller.js';
// import { toggleFollow, getFollowingPosts, toggleAccountPrivacy } from '../controllers/user.controller.js';
// const router = express.Router();



// import { validationMiddleware } from '../middleware/validationMiddleware.js';
// import {
//   createUser,
//   getUsers,
//   getUserById,
//   updateUser,
//   deleteUser,
//   loginUser,
//   toggleBlock, 
//   reportUser
// } from '../controllers/user.controller.js';
// import {
//   createUserSchema,
//   loginUserSchema,
//   updateUserSchema
// } from '../validator/user.validator.js';
// // import { upload } from '../middleware/uploadMiddleware.js';
// import { authorizeRole } from '../middleware/roleMiddleware.js';



// import { forgotPassword, resetPassword } from '../controllers/user.controller.js';

// router.post('/:blockedId/block', authenticateToken, toggleBlock);
// router.post('/:reportedUserId/report', authenticateToken, reportUser);
// router.post('/privacy-toggle', authenticateToken, toggleAccountPrivacy);
// router.get('/:userId/posts', authenticateToken, getPostsByUser);
// router.post('/:followingId/follow', authenticateToken, toggleFollow);
// router.get('/feed', authenticateToken, getFollowingPosts);
// router.post('/forgot-password', forgotPassword);
// router.post('/reset-password/:token', resetPassword);
// router.post(
//   '/createuser',
//   // upload.single('profilePicture'),
//   validationMiddleware(createUserSchema),
//   createUser
// );



// router.post(
//   '/login',
//   validationMiddleware(loginUserSchema),
//   loginUser
// );

// router.post('/upload-profile',
//   authenticateToken,
//   (req, res, next) => {
//     console.log('Invoking getUploadMiddleware...');
//     const uploadMiddleware = getUploadMiddleware('single', 'profile');
//     uploadMiddleware(req, res, (err) => {
//       if (err) {
//         console.error(' Multer middleware error:', err);
//         return res.status(400).json({ message: 'File upload failed', error: err.message });
//       }
//       console.log('Upload middleware passed');
//       next();
//     });
//   },
//   uploadProfilePicture
// );



// router.put(
//   '/profile',
//   authenticateToken,
//   validationMiddleware(updateUserSchema),
//   updateUser
// );

// router.get(
//   '/',
//   authenticateToken,
//   authorizeRole('admin'),
//   getUsers
// );


// router.delete(
//   '/:id',
//   authenticateToken,
//   authorizeRole('admin'),
//   deleteUser
// );

// export default router;
import express from 'express';
import authenticateToken from '../middleware/authmiddleware.js';
import getUploadMiddleware from '../utils/multer.js';
import { validationMiddleware } from '../middleware/validationMiddleware.js';
import { updateUserSchema } from '../validator/user.validator.js';
import { authorizeRole } from '../middleware/roleMiddleware.js';
import { getPostsByUser } from '../controllers/post.controller.js';
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  toggleBlock,
  reportUser,
  toggleFollow,
  getFollowingPosts,
  toggleAccountPrivacy,
  uploadProfilePicture,
  resetPassword,
} from '../controllers/user.controller.js';

const router = express.Router();

// --- Social & Profile Routes ---

router.post('/:blockedId/block', authenticateToken, toggleBlock);
router.post('/:reportedUserId/report', authenticateToken, reportUser);
router.post('/privacy-toggle', authenticateToken, toggleAccountPrivacy);
router.get('/:userId/posts', authenticateToken, getPostsByUser);
router.post('/:followingId/follow', authenticateToken, toggleFollow);
router.get('/feed', authenticateToken, getFollowingPosts);

// Upload a new profile picture for the authenticated user
router.post('/upload-profile',
  authenticateToken,
  getUploadMiddleware('single', 'profile'),
  uploadProfilePicture
);

// Update the authenticated user's profile
router.put(
  '/profile',
  authenticateToken,
  validationMiddleware(updateUserSchema),
  updateUser
);

// --- Admin-only Routes ---

// Get all users (admin-only)
router.get(
  '/',
  authenticateToken,
  authorizeRole('admin'),
  getUsers
);

// Get a single user by ID
router.get(
  '/:id',
  authenticateToken,
  getUserById
);

// Delete a user by ID (admin-only)
router.delete(
  '/:id',
  authenticateToken,
  authorizeRole('admin'),
  deleteUser
);

export default router;
