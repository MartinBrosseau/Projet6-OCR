const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); 
const multer = require('../middleware/multer-config');
const saucesCtrl = require('../controllers/sauce');
const requestLimiter = require('../middleware/limiter');



router.post('/',requestLimiter, auth, multer, saucesCtrl.createSauce);

router.put('/:id', auth, multer, saucesCtrl.modifySauce);

router.delete('/:id', auth, saucesCtrl.deleteSauce);

router.get('/:id', auth, saucesCtrl.getOneSauce);

router.get('/', auth, saucesCtrl.getAllSauces);

router.post('/:id/like', auth, saucesCtrl.likeDislike);

module.exports = router;