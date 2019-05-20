/** 
 * Integrated tests for the KlassRouter
 * Author: R.Wood
 * Date: 02/04/2019
*/

'use strict';

const chai = require('chai');
const should = chai.should();

const chaiRequests = require('../chai-requests');

const Klass = require('../../models/klass');

const baseURL = '/api/classes';

describe('Klass Router', function() {
    describe('POST requests', function() {
        it ('should save a well-formed Klass to database with a POST', function(done) {
            const wellFormedKlass = {
                title : 'Underwater Basket Weaving',
                category : 'Arts and Farts',
                semesters_offered : ['FALL', 'SPRING'],
                grading_system : 'US - GPA x.y/4.0'
            };
    
    
            chaiRequests.postResource(baseURL, wellFormedKlass)
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
    
            chaiRequests.postResource(baseURL, badlyFormedKlass)
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

            chaiRequests.postResource(baseURL, anotherKlass)
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
                   return chaiRequests.getResource(baseURL);
                })
                .then(res => {
                    const resBody = res.body;

                    res.statusCode.should.eql(200);
                    resBody.should.have.property('classes');
                    resBody.classes.should.have.lengthOf(4);

                    done();
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

                    return chaiRequests.getResource(`${baseURL}/${klassId}`);
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
                    return chaiRequests.getResource(`${baseURL}/${klassId}`);
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

                    const updatedKlass = {
                        title : 'Underwater Basket Weaving',
                        _id : klassId
                    };

                    return chaiRequests.putResource(`${baseURL}/${klassId}`, updatedKlass);
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
                    return chaiRequests.putResource(`${baseURL}/${klassId}`, updatedKlass);
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

                    return chaiRequests.putResource(`${baseURL}/${klassId}`, updatedKlass);
                })
                .then(res => {
                    res.statusCode.should.eql(400);
                    done();
                })
                .catch(err => done(err));
        });
    });

    describe('DELETE requests', function() {
        it('should perform a soft delete at /api/classes/:id', function(done) {
            const newKlass = {
                title : 'Something'
            };

            let klassId;

            Klass
                .create(newKlass)
                .then(klass => {
                    klassId = klass._id;

                    return chaiRequests.deleteResource(`${baseURL}/${klassId}`);
                })
                .then(res => {
                    res.statusCode.should.eql(204);
                    done();
                })
                .catch(err => done(err));
        });
    });
});