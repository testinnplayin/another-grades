/**
 * @module controllers/klass-history-controllers
 * Module that contains the KlassHistory controller
 * @author R.Wood
 * Date: 02/04/2019
 * @requires module:models/klass
 * @requires module:models/klass-history
 * @requires module:helpers/checkers.checkReqFields
 * @requires module:constants/error-messages
 * @requires module:verification/klass
 */

/** @see module:models.klass*/
const Klass = require('../models/klass');

/** @see module:models.klass-history */
 const KlassHistory = require('../models/klass-history');

/** @see module:helpers.checkers.checkReqFields */
const { checkReqFields } = require('../helpers/checkers');

/** @see module:constants.errorMsgs.getBadlyFormedReq */
const { getBadlyFormedReq } = require('../constants/error-msgs');

/** @see module:verification.klass */
const klassVerifiers = require('../verification/klass');

/** @constant {Object} errMsgs - contains error messages used multiple times in this controller */
const errMsgs = {
    badReqMsg : getBadlyFormedReq(),
    noClass : 'cannot find associated class',
    noKH : 'cannot find class history',
    invSemester : 'invalid semester',
    invYear : 'invalid year'
};

/**
 * validateSemesterField (determines if the semester in the request body matches a semester that is offered on the klass document)
 * @param {Object} reqBody  - contains the parsed request body
 * @returns {Object} Resolves with an object containing the status code, an error message (if there was an error), and the klass (if successful)
 */
function validateSemesterField(reqBody) {
    return new Promise((resolve, reject) => {
        Klass
            .findOne({ _id : reqBody.class_id })
            .then(klass => {
                if (!klass) {
                    /** @throws a 404 and error message if can't find associated class */
                    resolve({ code : 404, errMsg : errMsgs.noClass, kTemplate : false });
                } else {
                    /**
                     * @constant {boolean} semesterOk - if true, the semester in request body is a semester offered on the klass document
                     * @see module.verification.klass.checkSemester
                     */
                    const semesterOk = klassVerifiers.checkSemester(klass.semesters_offered, reqBody.semester);
                
                    if (!semesterOk) {
                        /** @throws a 400 if semester is not valid and an error message */
                        resolve({ code : 400, errMsg : errMsgs.invSemester, kTemplate : false });
                    } else {
                        /** @returns a 200 if successful and the klass document */
                        resolve({ code : 200, errMsg : null, kTemplate : klass });
                    }
                }
            })
            .catch(err => reject(err));
    });
}

/**
 * validateYear
 * @param {Object} req - request body
 * @returns {boolean} A boolean is returned that is true if the year is valid
 */

function validateYear(req) {
    const kH = req.body;
    if (kH.hasOwnProperty('year')) {
        /**
         * @constant {boolean} yearOk - this is true when the year is a valid year
         * (NOTE: this is not defined at the level of the klassHistory model)
         * @see module.verification.klass.checkYear
         */
        const yearOk = klassVerifiers.checkYear(kH.year);

        if (!yearOk) {
            /** @throws a 400 if the year is not valid */
            req.errStatus = 400;
            throw new Error(errMsgs.invYear);
        }
    }
}

/**
 * resolveReqWSemester (resolves a request containing the semester field)
 * @param {Object} req - request
 * @param {Object} res - response
 * @callback next 
 * @returns a response to the client
 */

function resolveReqWSemester(req, res, next) {
    /** 
     * @constant {Object} kH - contains the parsed request body 
     * @constant {string} method - contains the request method used (either a POST or PUT)
    */
    const kH = req.body;
    const method = req.method;

    /** @var {Object} kTemplate - contains the klass document found in validateSemesterField... prevents having to touch another collection again for info we already have on hand */
    let kTemplate;

    validateSemesterField(kH)
        .then(semesterCheck => {
            if (semesterCheck.code !== 200) {
                /** @throws whatever error results from the semester check (a 400) */
                req.errStatus = semesterCheck.code;
                throw new Error(semesterCheck.errMsg);
            }

            return semesterCheck.kTemplate;
        })
        .then(klass => {
            kTemplate = klass;

            /**
             * If method is a POST, then create the new klassHistory document
             * If method is a PUT, then update the klassHistory document
             */
            if (method === 'POST') {
                return KlassHistory.create(kH);
            } else {
                return KlassHistory
                    .findOneAndUpdate({ _id : req.params.id }, { $set : kH }, { new : true });
            }
        })
        .then(newKH => {
            /** @var {number} status - contains either a 201 (if POST) or 200 code (if PUT) */
            let status;

            (method === 'POST') ? status = 201 : status = 200;

            /** @see module:models.klassHistory.method.showKlass */
            return res.status(status).json({ class_history : newKH.showKlass(kTemplate) });
        })
        .catch(next);
}

module.exports = {
    /**
     * Creates a new KlassHistory document
     * @callback next
     * @param {Object} req - request object
     * @param {Object} res - response object
     * @returns either an error or a JSON object containing the KlassHistory document
     */
    create (req, res, next) {
        /**
         * @constant {Object} nKH - new klassHistory object coming in from request
         * @constant {string[]} reqFields - contains class_id and year fields for checking requeset body against
         */
        const nKH = req.body;
        const reqFields = ['class_id', 'year'];

        /** 
         * @namespace {Object} reqStatus - determines the status of the request (whether ok or not)
         * @member {boolean} isOk - if false the request body is badly-formed
         * @member {string} msg - if exists, it provides a message to send to the client
         */
        let reqStatus = checkReqFields(reqFields, nKH);

        if (!reqStatus.isOk) {
            req.errStatus = 400;
            /** @throws sends a 400 error to client if a required field for database coherency is missing in request body */
            throw new Error(reqStatus.msg);
        }

        validateYear(req);

        resolveReqWSemester(req, res, next);
    },
    /**
     * Delete - performs soft delete on a class history document in the database
     * @param {Object} req - contains request object
     * @param {Object} res - contains response object
     * @callback next
     * @returns {Object} A response with either an error or a 204
     */
    delete(req, res, next) {
        KlassHistory
            .delete({ _id : req.params.id })
            .then(result => {
                if (result.nModified !== 1) {
                    /** @throws a 404 if nothing is found and modified */
                    req.errStatus = 404;
                    throw new Error(errMsgs.noKH);
                }

                return res.status(204).end();
            })
            .catch(next);
    },
    /**
     * fetches all class history documents
     * @callback next
     * @param {Object} req - request object
     * @param {Object} res - response object
     * @returns either an error or a JSON object containing an array of class history documents
     */
    fetchAll(req, res, next) {
        KlassHistory
            .find()
            .populate('class_id')
            .then(kHs => {
                /** @see module.models.klassHistory.method.showKlass */
                return res.status(200).json({ class_histories : kHs.map(kH => kH.showKlass(kH.class_id)) });
            })
            .catch(next);
    },
    /**
     * fetches a specific class history document
     * @callback next
     * @param {Object} req - request object
     * @param {Object} res - response object 
     * @returns either an error or a JSON object containing the class history document
     */
    fetchOne(req, res, next) {
        KlassHistory
            .findOne({ _id : req.params.id })
            .populate('class_id')
            .then(kH => {
                if (!kH) {
                    req.errStatus = 404;
                    /** @throws this 404 is returned when the document no longer exists in the collection */
                    throw new Error('cannot find classHistory ', req.params.id);
                }

                /** @see module.models.klassHistory.method.showKlass */
                return res.status(200).json({ class_history : kH.showKlass(kH.class_id) });
            })
            .catch(next);
    },
    /**
     * restoreOne - restores a single klassHistory document
     * @param {req} req - request object
     * @param {res} res - response object
     * @callback next
     * @returns either an error or a JSON object containing the classhistory document
     */
    restoreOne(req, res, next) {
        KlassHistory
            .restore({ _id : req.params.id })
            .then(result => {
                if (result.n !== 1) {
                    /** @throws a 404 if document is not found */
                    req.errStatus = 404;
                    throw new Error(errMsgs.noKH);
                }

                return KlassHistory.findOne({ _id : req.params.id }).populate('class_id');
            })
            .then(restoredKH => {
                /** @see module.models.klassHistory.method.showKlass */
                return res.status(200).json({ class_history : restoredKH.showKlass(restoredKH.class_id) });
            })
            .catch(next)
    },
    /**
     * updates everything BUT the student array
     * @callback next
     * @param {Object} req - request object
     * @param {Object} res - response object
     * @returns either an error or a JSON object containing the updated class history document
     */
    update(req, res, next) {
        /** @var {Object} uKH - what will be update object coming in from the request */
        let uKH = req.body;

        if (uKH.hasOwnProperty('students')) {
            /** @throws a 400 if there is a students field because students array is handled elsewhere */
            req.errStatus = 400;
            throw new Error(`${badReqMsg}, invalid field present.`);
        }

        /** @constant {string[]} reqFields - contains required fields that must be in request body */
        const reqFields = ['class_id'];

        /** 
         * @namespace {Object} reqStatus - determines the status of the request (whether ok or not)
         * @member {boolean} isOk - if false the request body is badly-formed
         * @member {string} msg - if exists, it provides a message to send to the client
         */
        let reqStatus = checkReqFields(reqFields, uKH);

        if (!reqStatus.isOk) {
            /** @throws a 400 if the request body doesn't contain a class_id field */
            req.errStatus = 400;
            throw new Error(reqStatus.msg);
        }

        validateYear(req);

        if (uKH.hasOwnProperty('semester')) {
            resolveReqWSemester(req, res, next);
        } else {
            KlassHistory
                .findOneAndUpdate({ _id : req.params.id }, { $set : uKH }, { new : true })
                .populate('class_id')
                .exec()
                .then(updatedKH => {
                    if (!updatedKH) {
                        /** @throws 404 error if cannot find the klassHistory document */
                        req.errStatus = 404;
                        throw new Error(errMsgs.noKH);
                    }

                    /** @see module:models.klassHistory.method.showKlass */
                    return res.status(200).json({ class_history : updatedKH.showKlass(updatedKH.class_id) });
                })
                .catch(next);
        }
    }
};