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

    describe('GET requests', function() {
        let kHId;
        beforeEach(function(done) {
            const newKlassHistory = {
                class_id : klassId,
                semester : 'FALL',
                year : 2019,
                students : []
            };
    
            KlassHistory
                .create(newKlassHistory)
                .then(nKH => {
                    kHId = nKH._id;
                    done();
                })
                .catch(err => done(err));
        });

        it('GET a specific class history should return a class history document with class info', function(done) {
            chaiRequests
                .getResource(`${baseURL}/${kHId}`)
                .then(res => {
                    res.statusCode.should.eql(200);
                    
                    const resBody = res.body;
                    resBody.should.have.property('class_history');
                    
                    const classHistory = resBody.class_history;
                    classHistory.should.have.property('class');
                    classHistory.class.should.be.a('object');
                    done();
                })
                .catch(err => done(err));
        });

        it('GET all class history documents should return an array of class history documents', function (done) {
            const anotherKH = {
                class_id : klassId,
                semester : 'SPRING',
                year : 2018,
                students : []
            };

            KlassHistory
                .create(anotherKH)
                .then(() => {
                    return chaiRequests.getResource(`${baseURL}/`);
                })
                .then(res => {
                    res.statusCode.should.eql(200);

                    const resBody = res.body;
                    resBody.should.have.property('class_histories');

                    const classHistories = resBody.class_histories;

                    classHistories.should.be.a('array');
                    classHistories.should.have.lengthOf(2);

                    done();
                })
                .catch(err => done(err));
        });
    });

    describe('PUT requests', function () {
        let kHId;

        beforeEach(function(done) {
            const newKlassHistory = {
                class_id : klassId,
                semester : 'FALL',
                year : 2019,
                students : []
            };

            KlassHistory
                .create(newKlassHistory)
                .then(nKH => {
                    kHId = nKH._id;
                    done();
                })
                .catch(err => done(err));
        });

        it('PUT a specific class history should update a class history object', function (done) {
            const uKH = {
                year : 2018,
                class_id : klassId
            };

            chaiRequests
                .putResource(`${baseURL}/${kHId}`, uKH)
                .then(res => {
                    res.statusCode.should.eql(200);
                    
                    const resBody = res.body;

                    resBody.should.have.property('class_history');
                    
                    const rKH = resBody.class_history;
                    rKH.should.have.property('year');
                    rKH.year.should.eql(2018);

                    done();
                })
                .catch(err => done(err));
        });

        it('PUT a specific class history should throw a 400 if class id is missing', function (done) {
            const uKH = {
                year : 2018
            };

            chaiRequests
                .putResource(`${baseURL}/${kHId}`, uKH)
                .then(res => {
                    res.statusCode.should.eql(400);

                    done();
                })
                .catch(err => done(err));
        });

        it('PUT a specific class history should throw a 400 if the request contains the students field', function (done) {
            const uKH = {
                students : [{ _id : '1'}]
            };

            chaiRequests.putResource(`${baseURL}/${kHId}`, uKH)
                .then(res => {
                    res.statusCode.should.eql(400);
                    done();
                })
                .catch(err => done(err));
        });

        it('PUT a specific class history should throw a 400 if the semester in request is not offered', function (done) {
            const uKH = {
                semester : 'SUMMER'
            };

            chaiRequests.putResource(`${baseURL}/${kHId}`, uKH)
                .then(res => {
                    res.statusCode.should.eql(400);
                    done();
                })
                .catch(err => done(err));
        });
    });

    // describe('DELETE requests', function() {
    //     beforeEach(function(done) {
    //         const newKlassHistory = {
    //             class_id : klassId,
    //             semester : 'FALL',
    //             year : 2019,
    //             students : []
    //         };

    //         KlassHistory
    //             .create(newKlassHistory)
    //             .then(nKH => {

    //             })
    //             .catch(err => done(err));
    //     });
    // });
});
