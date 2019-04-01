'use strict';

const express = require('express');
const router = express.Router();

const KlassController = require('../controllers/klass');

// REQUESTS

// POST requests

router.post('/', KlassController.create);

router.use(function(err, req, res, next) {
    console.error(`[ERROR] ${err.code} | ${req.method} at ${req.baseUrl}: ${err}`);
    res.statusMessage = err.message;
    return res.status(err.code);
});

module.exports = router;