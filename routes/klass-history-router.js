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

// GET Requests

/**
 * gets class history documents at /api/class-histories
 * @method get
 * @callback klassHistoryController.fetchAll
 * @param {string} - partial url of route call
 * @see module:controllers/klass-history.fetchAll
 */

router.get('/', klassHistoryController.fetchAll);

/**
 * gets a specific class history document at /api/class-history/:id
 * @method get
 * @callback klassHistoryController.fetchOne
 * @param {string} - partial url of route call
 * @see module:controllers/klass-history.fetchOne
 */

router.get('/:id', klassHistoryController.fetchOne);

// POST Requests

/**
 * posts a new class history document at /api/class-histories
 * @method post 
 * @callback klassHistoryController.create
 * @param {string} - partial url of route call
 * @see module:controllers/klass-history.create
 */
router.post('/', klassHistoryController.create);

// PUT Requests

/**
 * updates an extant class history document at /api/class-histories/:id
 * @method put
 * @callback klassHistoryController.update
 * @param {string} - partial url of route call
 * @see module:controllers/klass-history.update
 */

router.put('/:id', klassHistoryController.update);

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