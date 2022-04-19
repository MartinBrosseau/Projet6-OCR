const passwordValidator = require('password-validator');

const passwordSchema = new passwordValidator();
console.log(passwordSchema);

passwordSchema
.is().min(8)                                   
.has().uppercase()                              
.has().lowercase()                              
.has().digits();  