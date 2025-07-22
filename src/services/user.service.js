import db from '../models/index.js';
const { User } = db;

export async function updateUserService(userId, updateData) {
  await User.update(updateData, { where: { id: userId } });
  return await User.findByPk(userId);
}