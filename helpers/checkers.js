'use strict';

module.exports = {
    /**
     * function that checks for required fields in a request body
     * @param  {string[]} reqFields - an array of strings; denotes required fields in request body
     * @param  {Object} reqBody - the request body
     * @returns an object that contains a property isOk, which is a Boolean (true if everything is okay) and a property msg if not
     */
    checkReqFields (reqFields, reqBody) {
        for (let field of reqFields) {
            if (!reqBody.hasOwnProperty(field)) {
                return { isOk : false, msg : `request missing required field ${field}` };
            }

            if (reqBody.hasOwnProperty(field) && !reqBody[field]) {
                return { isOk : false, msg : `required field ${field} empty in request` };
            }
        }

        return { isOk : true, msg : null };
    }
};