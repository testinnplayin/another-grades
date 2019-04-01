'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StudentSchema = new Schema({
    name : {
        type : String,
        required : true
    },
    student_id : {
        type : String,
        unique : true,
        dropDups : true
    },
    contact_info : Schema.Types.Mixed,
    enrolled : Boolean,
    class_history : [{
        type : Schema.Types.ObjectId,
        ref : 'KlassHistory'
    }]
});

const Student = mongoose.model('Student', StudentSchema);

module.exports = Student;