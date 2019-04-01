'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const KlassSchema = new Schema({
    title : {
        type : String,
        required : true
    },
    category : String,
    semesters_offered : {
        type : String,
        enum : [
            'FALL',
            'SPRING',
            'SUMMER',
            'N/A'
        ]
    }
},
{
    collection : 'classes'
});

const Klass = mongoose.model('Klass', KlassSchema);

module.exports = Klass;