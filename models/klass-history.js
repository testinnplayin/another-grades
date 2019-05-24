/**
 * @module model/klass-history
 * Module that creates a KlassHistory model
 * @author R.Wood
 * Date: 02/04/2019
 */

'use strict';

// IMPORTS

// VENDOR

const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');

const Schema = mongoose.Schema;


/**
 * Create a new class history schema in Mongoose; this model is much like an instance of a class for a given semester/year
 * @class
 */
const klassHistorySchema = new Schema(
    /** @lends klassHistorySchema.prototype */
    {
        /** @member {string} class_id - ObjectId of associated class document */
        class_id : {
            type : Schema.Types.ObjectId,
            ref : 'Klass',
            required : true,
            index : true
        },
        /** @member {number} year - the year the class is being given */
        year : {
            type : Number,
            required : true
        },
        /** @member {string} [semester=N/A] - the semester the class is being given */
        semester : {
            type : String,
            /** @enum {string} */
            enum : [
                'FALL',
                'SPRING',
                'SUMMER',
                'N/A'
            ],
            default : 'N/A'
        },
        /** @member {string[]} [students] - an array of student ObjectIds */
        students : [{
            type : Schema.Types.ObjectId,
            ref : 'Student'
        }]
    },
    {
        /** @property {string} collection - The name of the collection, which is class-history */
        collection : 'class-history'
    });

// METHODS

/**
 * @function
 * @param {Object} klass - a class document
 * @returns a KlassHistory document for display by the client
 */
klassHistorySchema.methods.showKlass = function(klass) {
    return {
        class_id : klass._id,
        year : this.year,
        semester : this.semester,
        students : this.students,
        class : {
            title : klass.title,
            category : klass.category,
            grading_system : klass.grading_system
        }
    };
};

klassHistorySchema.plugin(mongoose_delete, { overrideMethods : 'all' });

const KlassHistory = mongoose.model('KlassHistory', klassHistorySchema);

/**
 * Exports the KlassHistory model
 * @type {Object}
 */
module.exports = KlassHistory;