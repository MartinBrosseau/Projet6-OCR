//Ce fichier comporte toute la logique métier concernant les sauces(création, modification et suppression)
//On importe notre modèle de sauce
const Sauce = require('../models/sauce');

const fs = require('fs');


//Création d'une nouvelle sauce
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    likes : 0,
    dislikes : 0,
    usersliked : [],
    userdisliked : []
  });
  sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
    .catch(error => res.status(400).json({ error }));
};

//Modification d'une sauce existante
exports.modifySauce = (req, res, next) => {
  let sauceObject = {};
  req.file ? ( //Si la modification contient une image, on supprime l'ancienne image
    Sauce.findOne({
      _id: req.params.id
    }).then((sauce) => {
      const filename = sauce.imageUrl.split('/images/')[1]
      fs.unlinkSync(`images/${filename}`)
    }),
    sauceObject = {//Puis on ajoute la nouvelle image
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${
        req.file.filename
      }`,
    }
  ) : ( //Si la modification ne contient une nouvelle image
    sauceObject = {
      ...req.body
    }
  )
  Sauce.updateOne(   
    {
      _id: req.params.id
    }, {
      ...sauceObject,
      _id: req.params.id
    }
  )
  .then(() => res.status(200).json({
    message: 'Sauce modifiée !'
  }))
  .catch((error) => res.status(400).json({
    error
  }))
};

//Suppression d'une sauce
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {//Avant de supprimer la sauce, on va chercher l'url de l'image pour la supprimer de la base avec "unlink"
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })//On supprime l'objet correspondant de la base
          .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

//Récuperation d'une sauce en particulier
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })// On utilise findOne et on lui passe l'objet de comparaison, on veut que l'id de la sauce soit le même que le paramètre de requête
      .then(sauce => res.status(200).json(sauce))// Si ok on retourne une réponse et l'objet
      .catch(error => res.status(404).json({ error }));//Erreur 404 si on ne trouve pas l'objet
};

//Récuperation de toute les sauces présentes sur la base MongoDB
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

//Like et dislike des sauces
exports.likeDislike = (req, res, next) => {
    let like = req.body.like
    let userId = req.body.userId
    let sauceId = req.params.id
  
    if (like === 1) { //Pour les likes on push l'utilisateur et on incrémente de 1 le compteur de like
      Sauce.updateOne({
          _id: sauceId
        }, {
          $push: {
            usersLiked: userId
          },
          $inc: {
            likes: +1
          }, 
        })
        .then(() => res.status(200).json({
          message: 'Like ajouté !'
        }))
        .catch((error) => res.status(400).json({
          error
        }))
    }
    if (like === -1) {//Pour les dislikes on push l'utilisateur et on incrémente de 1 le compteur de dislike
      Sauce.updateOne( 
          {
            _id: sauceId
          }, {
            $push: {
              usersDisliked: userId
            },
            $inc: {
              dislikes: +1
            }, 
          }
        )
        .then(() => {
          res.status(200).json({
            message: 'Dislike ajouté !'
          })
        })
        .catch((error) => res.status(400).json({
          error
        }))
    }
    if (like === 0) { //Pour annuler un like ou un dislike
      Sauce.findOne({
          _id: sauceId
        })
        .then((sauce) => {
          if (sauce.usersLiked.includes(userId)) { //Pour annuler un like, on incrémente de -1 le compteur
            Sauce.updateOne({
                _id: sauceId
              }, {
                $pull: {
                  usersLiked: userId
                },
                $inc: {
                  likes: -1
                }, 
              })
              .then(() => res.status(200).json({
                message: 'Like retiré !'
              }))
              .catch((error) => res.status(400).json({
                error
              }))
          }
          if (sauce.usersDisliked.includes(userId)) {//Pour annuler un dislike, on incrémente de -1 le compteur
            Sauce.updateOne({
                _id: sauceId
              }, {
                $pull: {
                  usersDisliked: userId
                },
                $inc: {
                  dislikes: -1
                }, 
              })
              .then(() => res.status(200).json({
                message: 'Dislike retiré !'
              }))
              .catch((error) => res.status(400).json({
                error
              }))
          }
        })
        .catch((error) => res.status(404).json({
          error
        }))
    }
}