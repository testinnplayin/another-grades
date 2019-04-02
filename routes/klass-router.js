/**
 * @module /routes/klass-router
 * Module that contains routers linked to /api/classes route
 * @author R.Wood
 * Date: 01/04/2019
 * @requires module:controllers/klass 
 * @requires module:handlers/error-handlers.genericErrorHandler
 */

'use strict';

// IMPORTS

// VENDOR

const express = require('express');
const router = express.Router();

/** @see module:controllers/klass */
const KlassController = require('../controllers/klass');

/** @see module:handlers/error-handlers.genericErrorHandler */
const { genericErrorHandler } = require('../handlers/error-handlers');

// REQUESTS

// DELETE requests

/** Delete route at /api/classes/:id
 * Router delete
 * @callback KlassController.remove
 * @param {string} - partial url of route call
 * @see module:controllers/klass.remove
 */
router.delete('/:id', KlassController.remove);

// GET requests

/** Get route at /api/classes
 * @callback KlassController.fetchAll
 * @param {string} - partial url of route call
 * @see module:controllers/klass.fetchAll
*/
router.get('/', KlassController.fetchAll);

/** Get route at /api/classes/:id
 * @callback KlassController.fetchOne
 * @param {string} - partial url of route call
 * @see module:controllers/klass.fetchOne
*/
router.get('/:id', KlassController.fetchOne);

// POST requests

/** Post route at /api/classes
 * @callback KlassController.create
 * @param {string} - partial url of route call
 * @see module:controllers/klass.create
 */

router.post('/', KlassController.create);

// PUT requests

/** PUT route at /api/classes/:id
 * @callback KlassController.update
 * @param {string} - partial url of route call
 * @see module:controllers/klass.update
 */
router.put('/:id', KlassController.update);

// MIDDLEWARE

/**
 * Middleware containing generic error handler
 * @see module:handlers/error-handlers.genericErrorHandler
 */

router.use(genericErrorHandler);

/**
 * Adds these methods to the Router object
 * @type {Object}
 */
module.exports = router;