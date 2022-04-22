//On se sert de multer pour gérer les fichiers entrant(ici les images)
const multer = require('multer');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');//On donne pour destination aux images le dossier 'images'
  },
  filename: (req, file, callback) => {//On génère un nouveau nom pour les images, en supprimant les espaces que l'on remplace par des underscore
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);//On génère le nom complet du fichier : nom d'origine + numéro unique.extension
  }
});

module.exports = multer({storage: storage}).single('image');
