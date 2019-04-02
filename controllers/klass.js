/** 
 * @module controllers/klass
 * Module containing class-related controllers
 * @author R.Wood
 * Date: 01/04/2019
 * @requires module:models/klass
 * @requires module:helpers/checkers.checkReqFields
 * @requires module:constants/error-msgs.getBadlyFormedReq
*/

'use strict';

/** @see module:models/klass */
const Klass = require('../models/klass');

/** @see module:helpers/checkers.checkReqFields */
const { checkReqFields } = require('../helpers/checkers');

/** @see module:constants/error-msgs.getBadlyFormedReq */
const { getBadlyFormedReq} = require('../constants/error-msgs');


module.exports = {
    /**
     * Creates a new class document in the database
     * @callback next 
     * @param  {Object} req - contains request object; must contain the field title in it
     * @param  {Object} res - contains response object
     * @return {Object} A response with either an error or JSON object with new class document
     */
    create (req, res, next) {
        const reqBody = req.body;
        /** 
         * @constant {string[]} reqFields - contains the required fields
         * @default 
         */
        const reqFields = ['title'];

        /**
         * @namespace
         * @member {boolean} isOk - contains evaluation of whether the request body is ok
         * @member {string} msg - contains message (if it exists) sent to client
         */
        
        let reqStatus = checkReqFields(reqFields, reqBody);

        if (!reqStatus.isOk) {
            req.errStatus = 400;
            /** @throws Will throw a 400 if required fields are empty or non present */
            throw new Error(`${getBadlyFormedReq()}: ${reqStatus.msg}`);
        }

        Klass
            .create(reqBody)
            .then(newKlass => {
                return res.status(201).json({ class : newKlass });
            })
            .catch(next);
    },
    /**
     * Fetches all class documents inside the database
     * @callback next 
     * @param  {Object} req - contains request object
     * @param  {Object} res - contains response object
     * @return {Object} A response with either an error or JSON object with classes
     */
    fetchAll (req, res, next) {
        Klass
            .find()
            .then(klasses => {
                return res.status(200).json({ classes : klasses });
            })
            .catch(next);
    },
    /**
     * Fetches a specific class document from the database
     * @callback next 
     * @param  {Object} req - contains request object
     * @param  {Object} res - contains response object
     * @return {Object} A response with either an error or JSON object with the class document
     */
    fetchOne (req, res, next) {
        Klass
            .findOne({ _id : req.params.id })
            .then(klass => {
                if (!klass) {
                    req.errStatus = 404;
                    /** @throws Will throw a 404 error if class can't be found */
                    throw new Error('cannot find class requested');
                }

                return res.status(200).json({ class : klass });
            })
            .catch(next);
    },
    /**
     * Performs soft delete on a class document in the database
     * @callback next
     * @param  {Object} req - contains request object
     * @param  {Object} res - contains response object
     * @return {Object} A response with either an error or a 204 response
     */
    remove (req, res, next) {
        Klass
            .delete({ _id : req.params.id})
            .then(result => {
                if (result.nModified !== 1) {
                    req.errStatus = 404;
                    /** @throws Will throw a 400 if required fields are empty or non present */
                    throw new Error('cannot find class requested');
                }

                return res.status(204).end();
            })
            .catch(next);
    },
    /**
     * Updates a new class document in the database
     * @callback next 
     * @param  {Object} req - contains request object
     * @param  {Object} res - contains response object
     * @return {Object} A response with either an error or JSON object with updated class document
     */
    update (req, res, next) {
        /**
         * @constant {string[]} reqFields - contains required fields that should be in request body
         * @default
         */
        const reqFields = ['_id', 'title'];
        
        /**
         * @namespace
         * @member {boolean} isOk - contains whether request body is ok or not
         * @member {string} msg - contains message (if present) to client
         */
        let reqStatus = checkReqFields(reqFields, req.body);

        if (!reqStatus.isOk) {
            req.errStatus = 400;
            /** @throws Will throw a 400 if required fields are empty or non present */
            throw new Error(`${getBadlyFormedReq()}: ${reqStatus.msg}`);
        }

        Klass
            .findOneAndUpdate({ _id : req.params.id }, req.body, { new : true })
            .then(uKlass => {
                if (!uKlass) {
                    req.errStatus = 404;
                    /** @throws Will throw a 400 if required fields are empty or non present */
                    throw new Error('cannot find class requested');
                }

                return res.status(200).json({ class : uKlass });
            })
            .catch(next);
    }
};