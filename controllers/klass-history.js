/**
 * @module controllers/klass-history-controllers
 * Module that contains the KlassHistory controller
 * @author R.Wood
 * Date: 02/04/2019
 * @requires module:models/klass-history
 */

 /**
  * @see module:models/klass-history
  */
 const KlassHistory = require('../models/klass-history');

 module.exports = {
    create (req, res, next) {
        console.log('create hit');
        KlassHistory
            .create(req.body)
            .then(newKH => {
                return res.status(201).json({ class_history : newKH });
            })
            .catch(next);
    }
 };