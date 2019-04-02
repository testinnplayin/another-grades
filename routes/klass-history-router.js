/**
 * @module routes/klass-history-router
 * Module that contains the KlassHistory router
 * @author R.Wood
 * Date: 02/04/2019
 * @requires module:controllers/klass-history
 * @requires module:handlers/error-handlers.genericErrorHandler
 */

const express = require('express');
const router = express.Router();

/** @see module:controllers/klass-history */
const klassHistoryController = require('../controllers/klass-history');

const { genericErrorHandler } = require('../handlers/error-handlers');

// REQUESTS

// POST Requesets

router.post('/', klassHistoryController.create);

// MIDDLEWARE

/**
 * Middleware containing generic error handler
 * @see module:handlers/error-handlers.genericErrorHandler
 */

 router.use(genericErrorHandler);
 
 /**
  * Add these methods to the Router object
  * @type {Object}
  */
 module.exports = router;