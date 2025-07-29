import { where } from 'sequelize';
import db from '../models/index.js'; 

const User = db.User; // Access the User model from your db object

class AdminUserService {
  /**
   * Fetches all user accounts.
   * @returns {Array<Object>} 
   */
  static async getAllUsers() {
    try {
      const users = await User.findAll({
        attributes: { exclude: ['password'] }, where:{is_active: true}
      });
      return users;
    } catch (error) {
      console.error('Error in AdminUserService.getAllUsers:', error);
      throw new Error('Could not retrieve users.');
    }
  }

  /**
   * Fetches details of a specific user by their ID.
   * @param {string} userId - The UUID of the user.
   * @returns {Object|null} The user object if found, otherwise null.
   */
  static async getUserById(userId) {
    try {
      const user = await User.findByPk(userId, {
        attributes: { exclude: ['password'] }
      });
      return user;
    } catch (error) {
      console.error(`Error in AdminUserService.getUserById for ID ${userId}:`, error);
      throw new Error(`Could not retrieve user with ID: ${userId}`);
    }
  }

  /**
   * Deletes a user (soft delete by setting is_active to false).
   * @param {string} userId - The UUID of the user to delete.
   * @returns {boolean} True if the user was successfully deleted/deactivated, false otherwise.
   */
  static async deleteUser(userId) {
    try {
      const user = await User.findByPk(userId);

      if (!user) {
        return false;
      }

      await user.update({ is_active: false });

      return true;
    } catch (error) {
      console.error(`Error in AdminUserService.deleteUser for ID ${userId}:`, error);
      throw new Error(`Could not delete/deactivate user with ID: ${userId}`);
    }
  }
}

export default AdminUserService;