'use strict';

require('dotenv').config();

const app = require('./app');

const http = require('http').createServer(app);

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const PORT = process.env.PORT;
const DATABASE = process.env.DATABASE;

mongoose.set('useFindAndModify', false);

mongoose.connect(DATABASE, { useNewUrlParser : true })
    .then(() => {
        console.log('Connected to database');
        http.listen(PORT, () => {
            console.log(`Server listening on port ${PORT}`);
        });
    })
    .catch(err => console.error('Error while trying to connect to database ', err));


mongoose.connection.on('disconnect', () => {
    console.warn('Database connection disconnecting');
});

http.on('close', () => {
    console.warn('Server closed');
});

process.on('SIGINT', () => {
    console.warn('Server being purposely shut down');
    mongoose.connection.close(() => {
        console.warn('Database shutting down');
        process.exit(1);
    });
});