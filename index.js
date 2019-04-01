'use strict';

require('dotenv').config();

const app = require('./app');

const http = require('http').createServer(app);

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const PORT = process.env.PORT;
const DATABASE = process.env.DATABASE;

console.log(PORT, DATABASE);

mongoose.set('useFindAndModify', false);

http.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});