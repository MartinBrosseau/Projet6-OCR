//Les routes concernant les sauces sont stockés dans ce fichier et on précise pour chaque route l'odre des différnts middleware et controllers
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); 
const multer = require('../middleware/multer-config');
const saucesCtrl = require('../controllers/sauce');
const requestLimiter = require('../middleware/limiter');


//Route permettant la création d'une sauce
router.post('/',requestLimiter, auth, multer, saucesCtrl.createSauce);

//Route permettant de modifier une sauce
router.put('/:id', auth, multer, saucesCtrl.modifySauce);

//Route permettant de supprimer une sauce
router.delete('/:id', auth, saucesCtrl.deleteSauce);

//Route permettant de récupérer une sauce en particulier
router.get('/:id', auth, saucesCtrl.getOneSauce);

//Route permettant de récupérer toutes les sauces
router.get('/', auth, saucesCtrl.getAllSauces);

//Route permettant de like / dislike les sauces
router.post('/:id/like', auth, saucesCtrl.likeDislike);

module.exports = router;