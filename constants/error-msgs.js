/**
 * @module constants/error-msgs
 * Module containing commonly-used error messages
 * @author R.Wood
 * Date: 02/04/2019
 */

'use strict';

module.exports = {
    /**
     * Function that returns a message for a badly-formed request(400 error)
     * @returns {string} The message
     */
    getBadlyFormedReq () {
        return 'Badly-formed request';
    },
    getCannotFind() {
        return 'Resource not found';
    }
};