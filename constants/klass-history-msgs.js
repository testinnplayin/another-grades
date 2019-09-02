/**
 * Module of constants with messages for klassHistory
 * @module klassHistoryConstants
 * @author R.Wood
 * Date: 30/05/209
 */

const { getBadlyFormedReq } = require('./error-msgs');
 
/** @constant {Object} errMsgs - contains error messages used multiple times in this controller */
const errMsgs = {
    badReqMsg : getBadlyFormedReq(),
    noClass : 'cannot find associated class',
    noKH : 'cannot find class history',
    invSemester : 'invalid semester',
    invYear : 'invalid year'
};

module.exports = { errMsgs };