'use strict';

const chai = require('chai');
const should = chai.should();
const chaiHTTP = require('chai-http');
chai.use(chaiHTTP);

// const mongoose = require('mongoose');
const Klass = require('../../models/klass');

const app = require('../../app');

function postKlass (fakeReqBody) {
    return new Promise((resolve, reject) => {
        chai.request(app)
            .post('/api/classes')
            .send(fakeReqBody)
            .then(function(res) {
                resolve(res);
            })
            .catch(function(err) {
                console.error(`Oops! ${err}`);
                reject(err);
            });
    });
}

function getKlass(url) {
    return new Promise((resolve, reject) => {
        chai.request(app)
            .get(url)
            .then(function(res) {
                resolve(res);
            })
            .catch(function(err) {
                console.error(`Oops! ${err}`);
                reject(err);
            });
    });
}

function putKlass(url, fakeReqBody) {
    return new Promise((resolve, reject) => {
        chai.request(app)
            .put(url)
            .send(fakeReqBody)
            .then(function(res) {
                resolve(res);
            })
            .catch(function(err) {
                reject(err);
            });
    });
}

describe('Klass Router', function() {
    describe('POST requests', function() {
        it ('should save a well-formed Klass to database with a POST', function(done) {
            const wellFormedKlass = {
                title : 'Underwater Basket Weaving',
                category : 'Arts and Farts',
                semesters_offered : ['FALL', 'SPRING'],
                grading_system : 'US - GPA x.y/4.0'
            };
    
    
            postKlass(wellFormedKlass)
                .then(res => {
                    const resBody = res.body;
    
                    resBody.should.have.property('class');
    
                    const klass = resBody.class;
    
                    klass.should.be.a('object');
                    klass.should.have.property('title');
                    klass.should.have.property('semesters_offered');
                    klass.semesters_offered.should.have.lengthOf(2);
    
                    done();
                })
                .catch(err => done(err));
        });
    
        it('should throw a 400 error if the POST request is badly-formed', function(done) {
            const badlyFormedKlass = {
                title : '',
                category : 'Philosophy',
                semesters_offered : ['SPRING'],
                grading_system : 'FR - x/20'
            };
    
            postKlass(badlyFormedKlass)
                .then(res => {
                    const resBody = res.body;
    
                    resBody.should.have.property('message');
                    resBody.message.should.include('Badly-formed request');
    
                    res.statusCode.should.eql(400);
    
                    done();
                })
                .catch(err => done(err));
        });

        it('should not throw an error if a non-required field is missing', function(done) {
            const anotherKlass = {
                title : 'Chemistry 101',
                category : 'Mathematics and Science',
                grading_system : 'US - letter (A, B, C, D, F)'
            };

            postKlass(anotherKlass)
                .then(res => {
                    res.statusCode.should.eql(201);
                    done();
                })
                .catch(err => done(err));
        });
    });

    describe('GET requests', function() {
        it('should GET all classes at /api/classes', function(done) {

            const arrOfClasses = [
                {
                    title : 'Class 1'
                },
                {
                    title : 'Class 2'
                },
                {
                    title : 'Class 3'
                },
                {
                    title : 'Class 4'
                }
            ];

            Klass
                .insertMany(arrOfClasses)
                .then(() => {
                    getKlass('/api/classes')
                        .then(res => {
                            const resBody = res.body;
                            res.statusCode.should.eql(200);
                            resBody.should.have.property('classes');
                            resBody.classes.should.have.lengthOf(4);
                            done();
                        })
                        .catch(err => done(err));
                })
                .catch(err => done(err));
        });

        it ('should GET a specific class at /api/classes/:id', function(done) {
            const arrOfClasses = [
                {
                    title : 'Underwater Basket Weaving'
                },
                {
                    title : 'Chemistry 101'
                },
                {
                    title : 'Tongue Wagging 101'
                }
            ];

            let klassId;

            Klass
                .insertMany(arrOfClasses)
                .then(() => {
                    return Klass.findOne()
                })
                .then(klass => {
                    klassId = klass._id;
                    console.log(klassId);
                    return getKlass(`/api/classes/${klassId}`);
                })
                .then(res => {
                    res.statusCode.should.eql(200);
                    const resBody = res.body;
                    const resBodyId = resBody.class._id;

                    resBody.should.have.property('class');
                    resBody.class.should.have.property('_id');
                    resBodyId.toString().should.equal(klassId.toString());
                    done();
                })
                .catch(err => done(err));
        });

        it('should throw a 404 error if ObjectId is not valid', function(done) {
            const newKlass = {
                title : 'Underwater Basket Weaving'
            };

            let klassId;

            Klass
                .create(newKlass)
                .then(klass => {
                    klassId = klass._id;
                    return Klass.deleteOne({ _id : klassId});
                })
                .then(() => {
                    return getKlass(`/api/classes/${klassId}`);
                })
                .then(res => {
                    res.statusCode.should.eql(404);
                    done();
                })
                .catch(err => done(err));
        });
    });
    
    describe('PUT requests', function() {
        it('should update a class at /api/classes/:id when well-formed', function(done) {
            const newKlass = {
                title : 'Underwater Basket Reaving',
                category : 'Arts and Farts'
            };

            let klassId;

            Klass
                .create(newKlass)
                .then(klass => {
                    klassId = klass._id;

                    console.log('klassId ', klassId);

                    const updatedKlass = {
                        title : 'Underwater Basket Weaving',
                        _id : klassId
                    };

                    return putKlass(`/api/classes/${klassId}`, updatedKlass);
                })
                .then(res => {
                    res.statusCode.should.eql = 200;

                    const resBody = res.body;
                    resBody.should.have.property('class');

                    const rKlass = resBody.class;
                    rKlass.should.have.property('title');
                    rKlass.title.should.eql('Underwater Basket Weaving');
                    done();
                })
                .catch(err => done(err));
        });

        it('PUT request should return a 404 if cannot find class', function(done) {
            const newKlass = {
                title : 'Chemistry 101'
            };

            let klassId;

            Klass
                .create(newKlass)
                .then(klass => {
                    klassId = klass._id;
                    return Klass.deleteOne({ _id : klass });
                })
                .then(() => {
                    const updatedKlass = {
                        title : 'Chemistry 102',
                        _id : klassId
                    };
                    return putKlass(`/api/classes/${klassId}`, updatedKlass);
                })
                .then(res => {
                    res.statusCode.should.eql(404);
                    done();
                })
                .catch(err => done(err));
        });

        it('PUT request should return a 400 if request badly-formed', function(done) {
            const newKlass = {
                title : 'Chemistry 101'
            };

            let klassId;

            Klass
                .create(newKlass)
                .then(klass => {
                    klassId = klass._id;

                    const updatedKlass = {
                        _id : klass._id,
                        semesters_offered : ['SPRING', 'FALL'],
                        title : ''
                    };

                    return putKlass(`/api/classes/${klassId}`, updatedKlass);
                })
                .then(res => {
                    res.statusCode.should.eql(400);
                    done();
                })
                .catch(err => done(err));
        });
    });
});