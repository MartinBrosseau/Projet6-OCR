//Les routes concernant les utilisateurs sont stockés dans ce fichier et on précise pour chaque route l'odre des différnts middleware et controllers
const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const signUpLimiter = require('../middleware/limiter');

//Route permettant de crée un nouvel utilisateur
router.post('/signup', signUpLimiter, userCtrl.signup);

//Route permettant de connecter un utilisateur existant
router.post('/login', userCtrl.login);

module.exports = router;