/**
 * @module app
 * This is the main app module for the HTTP server
 * @requires module:routes/klass-router
 * @requires module:routes/klass-history-router
 */

'use strict';

const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended : false }));
app.use(bodyParser.json());

/** 
 * @see module:routes/klass-router */

const klassRouter = require('./routes/klass-router');

/**
 * @see module:routes/klass-history-router */
 
const klassHistoryRouter = require('./routes/klass-history-router');

app.use('/api/classes', klassRouter);
app.use('/api/class-histories', klassHistoryRouter);

// Catch-all route

app.use('*', (req, res) => {
    return res.status(404).json({ message : 'Resource not found' });
});

/**
 * Exports the Express app object
 * @type {object}
 */
module.exports = app;