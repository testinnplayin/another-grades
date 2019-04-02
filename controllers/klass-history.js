/**
 * @module controllers/klass-history-controllers
 * Module that contains the KlassHistory controller
 * @author R.Wood
 * Date: 02/04/2019
 * @requires module:models/klass
 * @requires module:models/klass-history
 * @requires module:helpers/checkers.checkReqFields
 */

/**
 * @see module:models/klass
 */
const Klass = require('../models/klass');

/**
 * @see module:models/klass-history
 */
 const KlassHistory = require('../models/klass-history');

/** @see module:helpers/checkers.checkReqFields */
const { checkReqFields } = require('../helpers/checkers');

/**
 * Determines if the semester on the request body is valid with respect to what's on the class
 * @param {string[]} kSemestersOffered - semesters offered as defined on class
 * @param {string} rBodySemester - semester defined on request body
 * @returns a boolean that is true when the semester on the request body is validated
 */
function checkSemester(kSemestersOffered, rBodySemester) {
    return (!kSemestersOffered.includes(rBodySemester)) ? false : true;
}

/**
 * Checks that the client has sent a valid year (must be a number and has to be between 1900 and 2050)
 * @param {number} rBodyYear - a year as defined on request body
 * @returns a boolean that is true if the year is valid
 */
function checkYear(rBodyYear) {
    return (rBodyYear < 1900 || rBodyYear > 2050) ? false : (typeof rBodyYear !== 'number') ? false : true;
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
         * @constant {string[]} reqFields - contains class_id and year fields for checking requeset body against
         */
        const reqFields = ['class_id', 'year'];

        /** 
         * @namespace
         * @member {boolean} isOk - if false the request body is badly-formed
         * @member {string} msg - if exists, it provides a message to send to the client
         */
        let reqStatus = checkReqFields(reqFields, req.body),
            kTemplate;

        if (!reqStatus.isOk) {
            req.errStatus = 400;
            /** @throws sends a 400 error to client */
            throw new Error(reqStatus.msg);
        }

        Klass
            .findOne({ _id : req.body.class_id })
            .then(klass => {
                if (!klass) {
                    req.errStatus = 404;
                    /** @throws a 404 if can't find associated class */
                    throw new Error('cannot find associated class');
                }

                kTemplate = klass;
                return klass;
            })
            .then(klass => {
                /**
                 * @constant {boolean} semesterOk - this is true when the semester is valid
                 */
                const semestersOk = checkSemester(kTemplate.semesters_offered, req.body.semester);
                
                if (!semestersOk) {
                    req.errStatus = 400;
                    /**
                     * @throws a 400 if the semester is not valid
                     */
                    throw new Error('invalid semester');
                }

                return klass;
            })
            .then(klass => {
                /**
                 * @constant {boolean} yearOk - this is true when the year is a valid year
                 */
                const yearOk = checkYear(req.body.year);
                kTemplate = klass;

                if (!yearOk) {
                    req.errStatus = 400;
                    /**
                     * @throws a 400 if the year is not valid
                     */
                    throw new Error('invalid year');
                }

                return KlassHistory.create(req.body);
            })
            .then(newKH => {
                return res.status(201).json({ class_history : newKH.showKlass(kTemplate) });
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

                return res.status(200).json({ class_history : kH.showKlass(kH.class_id) });
            })
            .catch(next);
    }
};