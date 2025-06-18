const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authmiddleware');
const userController = require('../controllers/user.controller');

router.post('/', authenticateToken,userController.createUser);
router.get('/', authenticateToken, userController.getUsers);
router.get('/:id', authenticateToken, userController.getUserById);
router.put('/:id', authenticateToken, userController.updateUser);
router.delete('/:id', authenticateToken, userController.deleteUser);

module.exports = router;
