'use strict';

process.env.NODE_ENV = 'test';

var request = require('../../helper/setup-supertest')('http://localhost:3001')
  , chai = require('../../helper/setup-chai')
  , status = require('../../../lib/server/status')
  , login = require('../../helper/login')(request)
  , logout = require('../../helper/logout')(request)
  ;

describe('Report post API', () => {

	describe('#reportPost', () => {
		it('should not allow anonymous users to report post', (done) => {
      done();
		});

		it('should allow logged-in users to report post', (done) => {
      done();
		});

		it('should only allow user to report once', (done) => {
      done();
		});
	});

});