'use strict';

process.env.NODE_ENV = 'test';

var request = require('../../helper/setup-supertest')('http://localhost:3001')
  , chai = require('../../helper/setup-chai')
  , status = require('../../../lib/server/status')
  , login = require('../../helper/login')(request)
  , logout = require('../../helper/logout')(request)
  , mongoInit = require('../../init/mongo-init')
  , commentInit = require('../../init/comments-init')
  ;

describe('Add Comment API', () => {

  before((done) => {
    mongoInit.connect().then(commentInit).catch(console.log).fin(done);
  });

  after((done) => {
    commentInit().then(mongoInit.disconnect).catch(console.log).fin(done);
  });

  describe('#postComment', () => {

    it('should not allow anonymous users to post new comment', (done) => {
      request
        .post('/api/v1/comments/')
        .send({ text: 'malicious text' })
        .toPromise()
        .then((res) => {
          res.body.status.should.be.equal(status.codes.UserAuthRequired.code);
          res.body.value.should.have.property('message');
        })
        .then(done)
        .catch(done)
        .done();
    });

    it('should not be an empty post', (done) => {
      login('test@test.com', 'test')
        .then(() => {
          return request
            .post('/api/v1/comments/')
            .send({ text: '' })
            .toPromise();
        })
        .then((res) => {
          res.body.status.shoud.be.equal(status.codes.EmptyComment.code);
          res.body.value.should.have.property('message');
        })
        .then(logout)
        .then(done)
        .catch(done)
        .done();
    });

    it('should allow logged-in users to post new comment', (done) => {
      login('test@test.com', 'test')
        .then(() => {
          return request
            .post('/api/v1/comments/')
            .send({ text: 'yay im logged in' })
            .toPromise();
        })
        .then((res) => {
          res.body.status.shoud.be.equal(0);
          res.body.value.should.exist();
          return request
            .get('/api/v1/comments/')
            .toPromise();
        })
        .then((res) => {
          res.body.value.shoud.have.property('text', 'yay im logged in');
        })
        .then(logout)
        .then(done)
        .catch(done)
        .done();
    });
  });

});
