'use strict';

const chai = require('chai');
const should = chai.should();
const chaiHTTP = require('chai-http');
chai.use(chaiHTTP);

const mongoose = require('mongoose');

const app = require('../../app');

const Klass = require('../../models/klass');

describe('Klass Router', function() {
    it ('should save a well-formed Klass to database with a POST', function(done) {
        const wellFormedKlass = {
            title : 'Underwater Basket Weaving',
            category : 'Arts and Farts',
            semesters_offered : ['FALL', 'SPRING'],
            grading_system : 'US - GPA x.y/4.0'
        };

        chai.request(app)
            .post('/api/class')
            .send(wellFormedKlass)
            .then(function (res) {
                const resBody = res.body;

                resBody.should.have.property('class');

                const klass = resBody.class;

                klass.should.be.a('object');
                klass.should.have.property('title');
                klass.should.have.property('semesters_offered');
                klass.semesters_offered.should.have.lengthOf(2);
                
                done();
            })
            .catch(function(err) {
                console.error(`Oops! ${err}`);
                done(err);
            });
    });
});