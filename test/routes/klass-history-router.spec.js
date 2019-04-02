'use strict';

const chai = require('chai');
const should = chai.should();

const chaiRequests = require('../chai-requests');

const Klass = require('../../models/klass');
const KlassHistory = require('../../models/klass-history');

let klassId;

const baseURL = `/api/class-histories`;

describe('KlassHistory router', function() {
    beforeEach(function(done) {
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
            const newClassHistory = {
                class_id : klassId,
                year : 2019,
                semester : 'SPRING',
                students : []
            };

            chaiRequests
                .postResource(baseURL, newClassHistory)
                .then(res => {
                    res.statusCode.should.eql(201);

                    const resBody = res.body;

                    resBody.should.have.property('class_history');

                    const klassHistory = resBody.class_history;

                    klassHistory.should.be.a('object');
                    klassHistory.should.have.property('class');
                    klassHistory.should.have.property('year');

                    const stringValKH = klassHistory.class_id.toString();
                    const stringValK = klassId.toString();

                    stringValKH.should.be.eql(stringValK);

                    klassHistory.should.have.property('class');
                    const klass = klassHistory.class;
                    klass.should.be.a('object');

                    done();
                })
                .catch(err => done(err));
        });

        it('post should return a 400 if badly-formed request', function(done) {
            const badlyFormedKH = {
                year : 2019,
                semester : 'SPRING',
                students : []
            };

            chaiRequests
                .postResource(baseURL, badlyFormedKH)
                .then(res => {
                    res.statusCode.should.eql(400);
                    done();
                })
                .catch(err => done(err));
        });

        it('if the semester field does not match semesters_offered field in associated class, return a 400', function(done) {
            const badlyFormedKH = {
                class_id : klassId,
                semester : 'SUMMER',
                year : 2019,
                students : []
            };

            chaiRequests
                .postResource(baseURL, badlyFormedKH)
                .then(res => {
                    res.statusCode.should.eql(400);
                    done();
                })
                .catch(err => done(err));
        });

        it('if the year field is not between 1900 and 2050 or is not a number, then return a 400', function(done) {
            const badlyFormedKH = {
                class_id : klassId,
                semester : 'SPRING',
                year : '1980',
                students : []
            };

            chaiRequests
                .postResource(baseURL, badlyFormedKH)
                .then(res => {
                    res.statusCode.should.eql(400);
                    done();
                })
                .catch(err => done(err));
        });
    });
});
