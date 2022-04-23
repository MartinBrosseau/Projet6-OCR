//schéma de mot de passe permettant un certain nombre de prérequis afin que le mot de passe soit suffisament sécuriser
const passwordValidator = require('password-validator');

const passwordSchema = new passwordValidator();
console.log(passwordSchema);

passwordSchema
.is().min(8)                                   
.has().uppercase()                              
.has().lowercase()                              
.has().digits();  