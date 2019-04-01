'use strict';

const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended : false }));
app.use(bodyParser.json());


// Catch-all route

app.use('*', (req, res) => {
    return res.status(404).json({ message : 'Resource not found' });
});

module.exports = app;