/**
 * @module /handlers/error-handlers
 * Module that handles errors
 * @author R.Wood
 * Date: 02/04/2019
 */

'use strict';

module.exports = {
    /**
     * Error handler
     * @callback next
     * @param  {Object} err - contains an Error object
     * @param  {Object} req - contains a request object
     * @returns an error status with a message inside a JSON object
     */
    genericErrorHandler (err, req, res, next) {
        console.error(`[ERROR] ${req.errStatus || 500} | ${req.method} at ${req.baseUrl}: ${err}`);

        res.statusMessage = err.message;
    
        return res.status(req.errStatus || 500).json({ message : err.message });
    }
};