import { genSalt, hash, compare } from 'bcrypt';

export async function hashPassword(password) {
  const salt = await genSalt(10);
  return hash(password, salt);
}

export async function comparePassword(password, hashedPassword) {
  return compare(password, hashedPassword);
}
