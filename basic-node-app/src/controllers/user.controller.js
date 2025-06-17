const db = require('../models');
const User = db.User;

exports.createUser = async (req, res) => {
  try {
    const { username, firstname, lastname, password, dob } = req.body;
    const user = await User.create({ username, firstname, lastname, password, dob });
    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUsers = async (req, res) => {
  try {
    console.log("-------------");
    const users = await User.findAll({ include: 'posts' });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
