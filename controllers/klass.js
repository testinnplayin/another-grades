'use strict';

const Klass = require('../models/klass');

const { checkReqFields } = require('../helpers/checkers');

module.exports = {
    create (req, res, next) {
        const reqBody = req.body;

        const reqFields = ['title'];

        let reqStatus = checkReqFields(reqFields, reqBody);

        if (!reqStatus.isOk) {
            req.errStatus = 400;
            throw new Error(`Badly-formed request: ${reqStatus.msg}`);
        }

        Klass
            .create(reqBody)
            .then(newKlass => {
                return res.status(201).json({ class : newKlass });
            })
            .catch(next);
    },
    fetchAll (req, res, next) {
        Klass
            .find()
            .then(klasses => {
                return res.status(200).json({ classes : klasses });
            })
            .catch(next);
    },
    fetchOne (req, res, next) {
        Klass
            .findOne({ _id : req.params.id })
            .then(klass => {
                if (!klass) {
                    req.errStatus = 404;
                    throw new Error('cannot find class requested');
                }

                return res.status(200).json({ class : klass });
            })
            .catch(next);
    },
    update (req, res, next) {
        const reqFields = ['_id', 'title'];
        let reqStatus = checkReqFields(reqFields, req.body);

        if (!reqStatus.isOk) {
            req.errStatus = 400;
            throw new Error(`Badly-formed request: ${reqStatus.msg}`);
        }

        Klass
            .findOneAndUpdate({ _id : req.params.id }, req.body, { new : true })
            .then(uKlass => {
                if (!uKlass) {
                    req.errStatus = 404;
                    throw new Error('cannot find class requested');
                }

                return res.status(200).json({ class : uKlass });
            })
            .catch(next);
    }
};