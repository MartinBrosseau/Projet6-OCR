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
         required: [true, "Veuillez choisir un mot de passe"] 
        }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);