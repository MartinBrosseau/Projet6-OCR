const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const verifyPassword = require('../middleware/verifyPassword');
const signUpLimiter = require('../middleware/limiter');

router.post('/signup', signUpLimiter,  verifyPassword, userCtrl.signup,);

router.post('/login', userCtrl.login);

module.exports = router;