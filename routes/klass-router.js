'use strict';

const express = require('express');
const router = express.Router();

const KlassController = require('../controllers/klass');

// REQUESTS

// POST requests

router.post('/', KlassController.create);

router.use(function(err, req, res, next) {
    console.error(`[ERROR] ${req.errStatus || 500} | ${req.method} at ${req.baseUrl}: ${err}`);

    res.statusMessage = err.message;

    return res.status(req.errStatus || 500).json({ message : err.message });
});

module.exports = router;