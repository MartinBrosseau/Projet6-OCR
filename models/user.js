const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
//Model d'utilisateur
const userSchema = mongoose.Schema({
    email : { 
        type: String,
        required: true,// un seul utilisateur par addresse mail
        unique: true,
        match : [/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, "Veuillez entrer une adresse email correcte"]//L'adresse mail doit respecter les format d'adresse mail classique
    },
    password : { 
        type: String,
        required: true,
        match : [/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, "Votre mot de passe doit contenir 8caractères minimum, 1 majuscule, 1 miniscule, 1 chiffre et un caractère spécial"]
    }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);