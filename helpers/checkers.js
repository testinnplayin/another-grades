'use strict';

module.exports = {
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