'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const KlassSchema = new Schema({
    title : {
        type : String,
        required : true
    },
    category : String,
    semesters_offered : [{
        type : String,
        enum : [
            'FALL',
            'SPRING',
            'SUMMER',
            'N/A'
        ],
        default : 'N/A'
    }],
    grading_system : {
        type : String,
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
    collection : 'classes'
});

const Klass = mongoose.model('Klass', KlassSchema);

module.exports = Klass;