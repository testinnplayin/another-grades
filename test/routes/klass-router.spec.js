'use strict';

const chai = require('chai');
const should = chai.should();
const chaiHTTP = require('chai-http');
chai.use(chaiHTTP);

const app = require('../../app');

function postKlass (fakeReqBody) {
    return new Promise((resolve, reject) => {
        chai.request(app)
            .post('/api/class')
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
});