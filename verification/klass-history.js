/**
 * Module that contains functions that aid in klassHistory controller functionality
 * @module verification/klassHistory
 * @author R.Wood
 * Date: 30/05/2019
 * @requires module:models/klass
 * @requires module:verification/klass
 * @requires module:klassHistoryConstants.errMsgs
 */

 'use strict';

 const Klass = require('../models/klass');

 const klassVerifiers = require('../verification/klass');

 const errMsgs = require('../constants/klass-history-msgs');

 /** @exports verification/klassHistory */
 module.exports = {
     /**
      * checkForStudentsField - checks if the students field is present in request body in a route that doesn't handle updating that array
      * @param {Object} req - Express request body
      * @returns an error if the students field is present in the request body
      */
     checkForStudentsField (req) {
        if (req.body.hasOwnProperty('students')) {
            /** @throws a 400 if there is a students field because students array is handled elsewhere */
            req.errStatus = 400;
            throw new Error(`${errMsgs.badReqMsg}, invalid field present.`);
        }
     },
     /**
     * validateSemesterField (determines if the semester in the request body matches a semester that is offered on the klass document)
     * @param {Object} reqBody  - contains the parsed request body
     * @returns {Object} Resolves with an object containing the status code, an error message (if there was an error), and the klass (if successful)
     */
    validateSemesterField(reqBody) {
        return new Promise((resolve, reject) => {
            /** @see module:models/klass */
            Klass
                .findOne({ _id : reqBody.class_id })
                .then(klass => {
                    if (!klass) {
                        /** @throws a 404 and error message if can't find associated class */
                        resolve({ code : 404, errMsg : errMsgs.noClass, kTemplate : false });
                    } else {
                        /**
                         * @constant {boolean} semesterOk - if true, the semester in request body is a semester offered on the klass document
                         * @see module:klassVerifiers.checkSemester
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
    },
    /**
     * validateYear
     * @param {Object} req - request body
     * @returns {boolean} A boolean is returned that is true if the year is valid
     */
    validateYear(req) {
        /** @constant {Object} kH - klassHistory document coming in from request */
        const kH = req.body;

        if (kH.hasOwnProperty('year')) {
            /**
             * @constant {boolean} yearOk - this is true when the year is a valid year
             * (NOTE: this is not defined at the level of the klassHistory model)
             * @see module:verification/klass.checkYear
             */
            const yearOk = klassVerifiers.checkYear(kH.year);

            if (!yearOk) {
                /** @throws a 400 if the year is not valid */
                req.errStatus = 400;
                throw new Error(errMsgs.invYear);
            }
        }
    }
 };