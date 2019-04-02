/**
 * @module models/klass
 * Module containing the class (written Klass) model
 * Author: R.Wood
 * Date: 01/04/2019
 */

'use strict';

// IMPORTS

// VENDOR

const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');

const Schema = mongoose.Schema;

// MODEL

/**
 * Create a new class schema in Mongoose
 * @class
 * @lends KlassSchema.prototype
 */

const KlassSchema = new Schema(
    /** @constructs KlassSchema */
    {
    /** @member {string} title - title of the class */
    title : {
        type : String,
        required : true
    },
    /** @member {string} [category] - the category of the class, eg. 'Social Sciences' */
    category : String,
    /** @member {string[]} [semesters_offered=N/A] */
    semesters_offered : [{
        type : String,
        /** @enum {string} */
        enum : [
            'FALL',
            'SPRING',
            'SUMMER',
            'N/A'
        ],
        default : 'N/A'
    }],
    /** @member {string} [grading_system=US - letter (A, B, C, D, F)] - the grading system being used in the class */
    grading_system : {
        type : String,
        /** @enum {string} */
        enum : [
            'US - GPA x.y/4.0',
            'US - letter (A, B, C, D, F)',
            'FR - x/20',
            'IB - x/7'
        ],
        default : 'US - letter (A, B, C, D, F)'
    }
},
{
    /** @property {string} collection - The name of the collection, which is classes and not klasses */
    collection : 'classes'
});



KlassSchema.plugin(mongoose_delete, { overrideMethods : 'all' });

const Klass = mongoose.model('Klass', KlassSchema);

/** Create a Klass document
 * @type {Object}
 */
module.exports = Klass;