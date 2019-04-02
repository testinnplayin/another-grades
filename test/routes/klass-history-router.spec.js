'use strict';

const chai = require('chai');
const should = chai.should();

const chaiRequests = require('../chai-requests');

const Klass = require('../../models/klass');
const KlassHistory = require('../../models/klass-history');

let klassId;

const baseURL = `/api/class-histories`;

describe('KlassHistory router', function() {
    before(function(done) {
        const newKlass = {
            title : 'Underwater Basket Weaving',
            category : 'Arts and Farts',
            semesters_offered : ['FALL', 'SPRING'],
            grading_system : 'US - GPA x.y/4.0'
        };
    
        Klass
            .create(newKlass)
            .then(klass => {
                klassId = klass._id;
                done();
            })
            .catch(err => done(err));
    });

    describe('POST requests', function() {
        it('post should create a new class history document at /api/class-history', function(done) {
            console.log('klassId ', klassId);
            const newClassHistory = {
                class_id : klassId,
                year : 2019,
                semester : 'SPRING',
                students : []
            };

            chaiRequests
                .postResource(baseURL, newClassHistory)
                .then(res => {
                    console.log('worked');
                    res.statusCode.should.eql(201);

                    const resBody = res.body;

                    resBody.should.have.property('class_history');

                    const klassHistory = resBody.class_history;

                    klassHistory.should.be.a('object');
                    klassHistory.should.have.property('class_id');
                    klassHistory.should.have.property('year');

                    const stringValKH = klassHistory.class_id.toString();
                    const stringValK = klassId.toString();

                    stringValKH.should.be.eql(stringValK);
                    
                    done();
                })
                .catch(err => done(err));
        });
    });
});
