import { Router } from 'express';
import authenticateToken,{authorizeAdmin} from '../middleware/authmiddleware.js';
// import { authorizeRole } from '../middleware/roleMiddleware.js';
import AdminController from '../controllers/admin.controller.js'; 

const router = Router();

router.use(authenticateToken); // Ensures the user is logged in and token is valid
router.use(authorizeAdmin);   // Ensures the authenticated user has the 'admin' role

router.get('/users', AdminController.getUsers);

router.get('/users/:id', AdminController.getUserDetail);

router.delete('/users/:id', async (req, res, next) => {
  try {
    // Call the original controller method
    await AdminController.deletesingleUser(req, res, next);
  } catch (error) {
    // Pass the error to the next middleware (Express's error handling middleware)
    console.error(`Error deleting user with ID ${req.params.id}:`, error);
    next(error); // This will send the error to your global error handler
  }
});

export default router;













