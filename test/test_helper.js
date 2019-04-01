'use strict';

require('dotenv').config();

const mongoose = require('mongoose');
const TEST_DATABASE = process.env.TEST_DATABASE;

before(function(done) {
    mongoose.connect(TEST_DATABASE, { useNewUrlParser : true });
    mongoose.connection
        .once('open', () => {
            console.log('Connected to test database');
            done();
        })
        .on('error', err => {
            console.error('Error while trying to connect to test database ', err);
            done(err);
        });
});

afterEach(function(done) {
    mongoose.connection.dropDatabase()
        .then(() => done())
        .catch(err => done(err));
});