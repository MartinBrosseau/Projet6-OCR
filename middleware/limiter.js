const limiter = require('express-rate-limit');

const signUpLimiter = limiter.rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 5,
    message: 'Too many accounts created from this IP, please try again after an hour',
    standardHeaders: true,
    legacyHeaders: false,
})


const requestLimiter = limiter.rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again after an hour',
    tandardHeaders: true,
    legacyHeaders: false,
})



module.exports = limiter(signUpLimiter);
module.exports = limiter(requestLimiter);