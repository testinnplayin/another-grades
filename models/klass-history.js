'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const klassHistorySchema = new Schema({
    class_id : {
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

// METHODS

klassHistorySchema.methods.showKlass = function(klass) {
    return {
        class_id : this.class_id,
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

const KlassHistory = mongoose.model('KlassHistory', klassHistorySchema);

module.exports = KlassHistory;