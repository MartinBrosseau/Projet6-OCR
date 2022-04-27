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
let userId = req.body.userId; 
  req.file ? ( //Si la modification contient une image, on supprime l'ancienne image
    Sauce.findOne({ _id: req.params.id})
      .then((sauce) => {
        if (sauce.userId !== userId){  // On vérifie si l'id de l'utilisateur correspond a l'id du créateur de la sauce
          res.status(401).json({
            error:"Not your sauce !"
            });
          return;
        }
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
    { _id: req.params.id }, {
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
let userId = req.body.userId;
  Sauce.findOne({ _id: req.params.id })
  .then((sauce) => {
    if (sauce.userId !== userId){  // On vérifie si l'id de l'utilisateur correspond a l'id du créateur de la sauce
      res.status(401).json({
        error:"Not your sauce !"
        });
      return;
    }
    const filename = sauce.imageUrl.split('/images/')[1];
    fs.unlink(`images/${filename}`, () => {
      Sauce.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
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
let like = req.body.like;
let userId = req.body.userId;
  if (like === 1) { // Si il s'agit d'un like
    Sauce.findOne({ _id: req.params.id })
      .then((sauce) => {
        if (!sauce.usersLiked.includes(userId)) { //On vérifie que l'utilisateur n'a pas déja like la sauce
          Sauce.updateOne({ _id: req.params.id }, {
            $inc: { likes: +1 },
            $push: { usersLiked: req.body.userId },
            _id: req.params.id
          })
            .then(() => { res.status(201).json({ message: 'Ton avis a été pris en compte!' }); 
          })
            .catch((error) => { res.status(400).json({ error: error }); 
          });
        }
      })
  }
  if (like === -1) { //S'il s'agit d'un dislike
    Sauce.findOne({ _id: req.params.id })
      .then((sauce) => {
        if (!sauce.usersDisliked.includes(userId)) { //On vérifie que l'utilisateur n'a pas déja dislike la sauce
          Sauce.updateOne({ _id: req.params.id }, {
            $inc: { dislikes: +1 },
            $push: { usersDisliked: req.body.userId },
            _id: req.params.id
          })
            .then(() => { res.status(201).json({ message: 'Ton dislike a été pris en compte!' }); 
          })
            .catch((error) => { res.status(400).json({ error: error }); 
          });
        }
      })
  }
  if (like === 0) { // Si il s'agit d'annuler un like ou un dislike
    Sauce.findOne({ _id: req.params.id })
    .then((sauce) => { 
      if (sauce.usersLiked.includes(userId)) { //Pour annuler un like, on vérifie d'abord si la sauce est like par cet utilisateur
        Sauce.updateOne({ _id: req.params.id }, { 
          $inc: { likes: -1 },
          $pull: { usersLiked: req.body.userId },
          _id: req.params.id
        })
          .then(() => { res.status(201).json({ message: 'Ton avis a été pris en compte!' }); })
          .catch((error) => { res.status(400).json({ error: error }); });

        
      } if (sauce.usersDisliked.includes(userId)) { //Pour annuler un dislike, on vérifie d'abord si la sauce est dislike par cet utilisateur
        Sauce.updateOne({ _id: req.params.id }, {
          $inc: { dislikes: -1 },
          $pull: { usersDisliked: req.body.userId },
          _id: req.params.id
        })
          .then(() => { res.status(201).json({ message: 'Ton avis a été pris en compte!' }); 
        })
          .catch((error) => { res.status(400).json({ error: error }); 
        });
      }
    })
    .catch((error) => { res.status(404).json({ error: error }); });
  }
}