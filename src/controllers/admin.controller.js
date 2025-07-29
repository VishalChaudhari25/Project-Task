import AdminUserService from '../services/admin.service.js';

class AdminController {
   //Fetches a list of all users by calling the service.
  static async getUsers(req, res) {
    try {
      // Calls the service method to get users
      console.log("getting users froom admin controller")
      const users = await AdminUserService.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      console.error('Error in AdminController.getUsers:', error);
      // The service layer might throw specific errors; catch them here.
      res.status(500).json({ message: error.message || 'Internal Server Error' });
    }
  }

  
   
   //Fetches details of a specific user by calling the service.
  static async getUserDetail(req, res) {
    try {
      const { id } = req.params;
      const user = await AdminUserService.getUserById(id);

      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }

      res.status(200).json(user);
    } catch (error) {
      console.error('Error in AdminController.getUserDetail:', error);
      res.status(500).json({ message: error.message || 'Internal Server Error' });
    }
  }

  //Delete a user
  static async deletesingleUser(req, res) {
    try {
      const { id } = req.params;
      const success = await AdminUserService.deleteUser(id);
      console.log(success)

      if (!success) {
        return res.status(404).json({ message: 'User not found or already deleted.' });
      }
      res.status(200).json({ message: 'Deleted' });
    } catch (error) {
      console.error('Error in AdminController.deleteUser:', error);
      res.status(500).json({ message: error.message || 'Internal Server Error' });
    }
  }
}


export default AdminController;