process.env.NODE_ENV = 'test';

import { use } from 'chai';
import { request } from 'chai';

//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const db = require('../models/index');

chai.should();
use(chaiHttp);

// Initialize test db before tests
db.initDB();
describe('CRUD', () => {
	// db init timeout
	before((done) => {
		setTimeout(done, 100);
	});
  describe('Create Contact', () => {
    it(`It's should create contact and return his name`, (done) => {
      request(server)
        .post('/contacts')
        .send({identify: "first-contact", name: "John"})
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('Object');
          res.body.message.should.be.equal('Contact successfully created');
          res.body.identify.should.be.equal('first-contact');
          res.body.name.should.be.equal('John');
          done();
        });
    });
    it(`It shouldn't create contact, with error`, (done) => {
      request(server)
        .post('/contacts')
        .send({identify: "first-contact", name: "John"})
        .end((err, res) => {
          res.should.have.status(422);
          res.body.should.be.a('Object');
          res.body.message.should.be.equal('Contact is already created');
          res.body.identify.should.be.equal('first-contact');
          done();
        });
    });
  });

  describe('Update Contact', () => {
    it(`It should update contact`, (done) => {
      request(server)
        .put('/contacts/first-contact')
        .send({name: "Jack"})
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('Object');
          res.body.message.should.be.equal('Contact successfully updated!');
          res.body.name.should.be.equal('Jack');
          done();
        });
    });
    it(`Contact is not found`, (done) => {
      request(server)
        .put('/contacts/another-contact')
        .send({name: "Jack"})
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('Object');
          res.body.message.should.be.equal('Contact is not found!');
          done();
        });
    });
  });

  describe('Read Contact', () => {
    it(`Should return contact`, (done) => {
      request(server)
        .get('/contacts/first-contact')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('Object');
          res.body.identify.should.be.equal('first-contact');
          res.body.name.should.be.equal('Jack');
          done();
        });
    });
    it(`Should return "contact is not found"`, (done) => {
      request(server)
        .get('/contacts/another-contact')
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('Object');
          res.body.message.should.be.equal('Contact is not found');
          done();
        });
    });
  });

  describe('Delete Contact', () => {
    it(`Should delete user`, (done) => {
      request(server)
        .del('/contacts/first-contact')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('Object');
          res.body.message.should.be.equal('Contact removed successfully!');
          done();
        });
    });
    it(`Should return "contact is not found"`, (done) => {
      request(server)
        .del('/contacts/another-contact')
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('Object');
          res.body.message.should.be.equal('Contact is not found!');
          done();
        });
    });
  });
  
});