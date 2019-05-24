'use strict';

const app = require('../app');

const chai = require('chai');
const chaiHTTP = require('chai-http');
chai.use(chaiHTTP);

module.exports = {
    postResource(url, fakeReqBody) {
        return new Promise((resolve, reject) => {
            chai.request(app)
                .post(url)
                .send(fakeReqBody)
                .then(function(res) {
                    resolve(res);
                })
                .catch(function(err) {
                    console.error(`Oops! ${err}`);
                    reject(err);
                });
        });
    },
    
    getResource(url) {
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
    },
    
    putResource(url, fakeReqBody) {
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
    },
    
    deleteResource(url) {
        return new Promise((resolve, reject) => {
            chai.request(app)
                .delete(url)
                .then(function(res) {
                    resolve(res);
                })
                .catch(function(err) {
                    reject(err);
                });
        });
    },

    simplePutResource(url) {
        return new Promise((resolve, reject) => {
            chai.request(app)
                .put(url)
                .then(function(res) {
                    resolve(res);
                })
                .catch(function(err) {
                    reject(err);
                });
        });
    }
}