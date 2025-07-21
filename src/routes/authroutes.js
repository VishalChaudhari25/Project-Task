import express from 'express';
const router = express.Router();

import { login } from '../controllers/authcontroller.js';

router.post('/login', login);

export default router;
