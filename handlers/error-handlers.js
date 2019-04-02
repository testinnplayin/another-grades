'use strict';

/**
 * Error handler
 * @param  {Error} err - contains an Error object
 * @param  {object} req - contains a request object
 * @param  {object} res - contains a response object
 * @param  {function} next - contains the next function
 */

module.exports = {
    genericErrorHandler (err, req, res, next) {
        console.error(`[ERROR] ${req.errStatus || 500} | ${req.method} at ${req.baseUrl}: ${err}`);

        res.statusMessage = err.message;
    
        return res.status(req.errStatus || 500).json({ message : err.message });
    }
};