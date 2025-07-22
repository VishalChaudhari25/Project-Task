import { genSalt, hash, compare } from 'bcrypt';

export async function hashPassword(password) {
  const salt = await genSalt(10);
  // Ensure password is a string before hashing
  if (typeof password !== 'string') {
    throw new Error("Password to hash must be a string.");
  }
  return hash(password, salt);
}

export async function comparePassword(password, hashedPassword) {
  // Add type checks for robustness (highly recommended)
  if (typeof password !== 'string') {
    console.error("Error: Plain password for comparison is not a string. Type:", typeof password, "Value:", password);
    return false; // Or throw an error
  }
  if (typeof hashedPassword !== 'string') {
    console.error("Error: Hashed password for comparison is not a string. Type:", typeof hashedPassword, "Value:", hashedPassword);
    return false; // Or throw an error
  }
  // CORRECTED LINE: Pass the plain-text password directly
  return compare(password, hashedPassword);
}