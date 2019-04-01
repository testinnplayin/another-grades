'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const klassHistorySchema = new Schema({
    klass_id : {
        type : Schema.Types.ObjectId,
        ref : 'Klass',
        required : true,
        index : true
    },
    year : {
        type : Number,
        required : true
    },
    semester : {
        type : String,
        enum : [
            'FALL',
            'SPRING',
            'SUMMER',
            'N/A'
        ],
        default : 'N/A'
    },
    students : [{
        type : Schema.Types.ObjectId,
        ref : 'Student'
    }]
},
{
    collection : 'class-history'
});

const KlassHistory = mongoose.model('KlassHistory', klassHistorySchema);

module.exports = KlassHistory;