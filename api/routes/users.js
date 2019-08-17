const mongoose = require('mongoose');
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

const User = require('../models/User');

/////////////////////////////////////////////////////////////////////////
// Signup user
router.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  console.log(email);

  try {
    // Check for duplicate email address
    const user = await User.findOne({ email });
    if (user) {
      return res.status(422).json({ errors: { msg: 'Email already in use' } }); // 422 - conflict
    }

    // Encrypt password
    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      _id: new mongoose.Types.ObjectId(),
      email,
      password: encryptedPassword
    });

    const response = await newUser.save();

    console.log(response);

    res.status(201).json({
      message: 'User created successfully'
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      error
    });
  }
});

/////////////////////////////////////////////////////////////////////////
// Delete user
router.delete('/:userId', async (req, res) => {
  const id = req.params.userId;

  try {
    await User.findByIdAndDelete(id);

    res.status(200).json({
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      error
    });
  }
});

module.exports = router;
