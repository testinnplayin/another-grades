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
    }
};