require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const saucesRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');
const path = require('path');
const cookie = require('cookie-session');//gestion et sécurisation des cookies
const keygrip = require('keygrip');


const ID = process.env.ID;
const MDP = process.env.PASSWORD;
const ADRESS = process.env.ADRESS
//Connection a notre base de donnée MongoDB
mongoose.connect(`mongodb+srv://${ID}:${MDP}@${ADRESS}`,
    { useNewUrlParser: true,
    useUnifiedTopology: true })
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));
  
const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});
//Keygrip sert vérifier nos cookie grâce a une clé sécurisée
keylist = require("keygrip");
keylist = ["SEKRIT3", "SEKRIT2", "SEKRIT1"];

const cookieExpire = new Date(Date.now() + 3600000);
app.use(cookie({
    name: 'session',
    keys: keygrip(keylist),
    secret: process.env.SEC_SES,
    cookie: {
      secure: true,
      httpOnly: true,
      domain: 'http://localhost:3000',
      expires: cookieExpire
    }
}));



app.use(bodyParser.json());

app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;