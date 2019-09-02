'use strict';

const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    return res.render('index', {
        pageTitle : 'Grades App - Home',
        mainTitle : 'Welcome to Our Grades App'
    });
});

router.get('/class-templates', (req, res) => {
    return res.render('class-templates', {
       pageTitle : 'Grades App - Class Templates',
       mainTitle : 'Class Templates' 
    });
});

module.exports = router;