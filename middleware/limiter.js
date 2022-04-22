const limiter = require('express-rate-limit');


//Un limiter qui permet de restreindre le nombre de création de compte a 5 par heure
const signUpLimiter = limiter.rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 5,
    message: 'Too many accounts created from this IP, please try again after an hour',
    standardHeaders: true,
    legacyHeaders: false,
})

//Limite le nombre de requête (création de sauce notamment) a 50 par heure
const requestLimiter = limiter.rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 50,
    message: 'Too many requests from this IP, please try again after an hour',
    tandardHeaders: true,
    legacyHeaders: false,
})



module.exports = limiter(signUpLimiter);
module.exports = limiter(requestLimiter);