'use strict';

const Klass = require('../models/klass');

module.exports = {
    create (req, res, next) {
        const reqBody = req.body;

        Klass
            .create(reqBody)
            .then(newKlass => res.status(200).json({ class : newKlass }))
            .catch(next);
    }
};