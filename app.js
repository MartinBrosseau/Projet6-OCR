const express = require('express');

const app = express();

app.use((req, res) => {
    res.json({ message: 'requête reçue !' });
});

module.exports = app;