'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GradeSchema = new Schema({
    student : {
        type : Schema.Types.ObjectId,
        ref : 'Student',
        required : true
    },
    class : {
        type : Schema.Types.ObjectId,
        ref : 'KlassHistory',
        required : true
    },
    grade : {
        type : String,
        required : true
    },
    assignment : String,
    category : {
        type : String,
        enum : [
            'Homework',
            'Quiz',
            'Mock',
            'Final',
            'Mid-term',
            'Exam',
            'Other',
            'N/A'
        ],
        default : 'N/A'
    }
});

const Grade = mongoose.model('Grade', GradeSchema);

module.exports = Grade;