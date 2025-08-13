// import express from 'express';
// const router = express.Router();


// import { login } from '../controllers/authcontroller.js';

// router.post('/login', login);

// export default router;
import express from 'express';
import { validationMiddleware } from '../middleware/validationMiddleware.js';
import { createUserSchema, loginUserSchema } from '../validator/user.validator.js';
import {
  createUser,
  loginUser,
  forgotPassword,
  resetPassword,
} from '../controllers/user.controller.js';

const router = express.Router();

// Route for creating a new user (sign-up)
router.post(
  '/signup',
  validationMiddleware(createUserSchema),
  createUser
);

// Route for user login
router.post(
  '/login',
  validationMiddleware(loginUserSchema),
  loginUser
);

// Route for initiating a password reset
router.post('/forgot-password', forgotPassword);

// Route for resetting password with a token from the URL
router.post('/reset-password/:token', resetPassword);

export default router;
