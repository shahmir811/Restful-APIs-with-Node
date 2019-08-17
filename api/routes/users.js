const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const UserController = require('../controllers/UserController');

/////////////////////////////////////////////////////////////////////////
// Signup user
router.post('/signup', UserController.user_signup);

/////////////////////////////////////////////////////////////////////////
// login user
router.post('/login', UserController.user_login);

/////////////////////////////////////////////////////////////////////////
// Delete user
router.delete('/:userId', auth, UserController.user_delete);

module.exports = router;
