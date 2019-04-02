'use strict';

const express = require('express');
const router = express.Router();

const KlassController = require('../controllers/klass');

const { genericErrorHandler } = require('../handlers/error-handlers');

// REQUESTS

// POST requests

router.get('/', KlassController.fetchAll);
router.get('/:id', KlassController.fetchOne);
router.post('/', KlassController.create);
router.put('/:id', KlassController.update);

router.use(genericErrorHandler);

module.exports = router;