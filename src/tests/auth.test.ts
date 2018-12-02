process.env.NODE_ENV = 'test';

import { use } from 'chai';
import { request } from 'chai';

//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const db = require('../models/index');
let token;

chai.should();
use(chaiHttp);
// Initialize test db before tests
db.initDB();

describe('Auth', () => {
	// db init timeout
	before((done) => {
		setTimeout(done, 100);
	});
	describe('Sign up', () => {
		it(`should create user`, (done) => {
			request(server)
				.post('/signup')
				.send({ username: 'user', email: 'user@email.com', password: '123' })
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('Object');
					res.body.message.should.be.equal('User successfully created');
					res.body.username.should.be.equal('user');
					res.body.email.should.be.equal('user@email.com');
					done();
				});
		});
		it(`user already exists (email)`, (done) => {
			request(server)
				.post('/signup')
				.send({ username: 'username', email: 'user@email.com', password: '123' })
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('Object');
					res.body.message.should.be.equal('User is already exist');
					done();
				});
		});
		it(`user already exist (username)`, (done) => {
			request(server)
				.post('/signup')
				.send({ username: 'user', email: 'another@email.com', password: '123' })
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('Object');
					res.body.message.should.be.equal('User is already exist');
					done();
				});
		});
	});

	describe('Login', () => {
		it(`should return user data`, (done) => {
			request(server)
				.post('/login')
				.send({ username: 'user', password: '123' })
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('Object');
					res.body.username.should.be.equal('user');
					res.body.email.should.be.equal('user@email.com');
					res.body.token.should.be.a('string');
					token = res.body.token;
					done();
				});
		});
		it(`should return error`, (done) => {
			request(server)
				.post('/login')
				.send({ username: 'user', password: '1234' })
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('Object');
					res.body.message.should.be.equal('Wrong credentials!');
					done();
				});
		});
	});

	describe('Change user password', () => {
		it(`password can not be same`, (done) => {
			request(server)
				.post('/profile/change-password')
				.set('X-Token', token)
				.send({ oldPassword: '123', newPassword: '123' })
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('Object');
					res.body.message.should.be.equal('New Password can not be same as Old password');
					done();
				});
		});
		it(`old password incorrect`, (done) => {
			request(server)
				.post('/profile/change-password')
				.set('X-Token', token)
				.send({ oldPassword: '1234', newPassword: '123' })
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('Object');
					res.body.message.should.be.equal('Old password incorrect');
					done();
				});
		});
		it(`password successfully updated`, (done) => {
			request(server)
				.post('/profile/change-password')
				.set('X-Token', token)
				.send({ oldPassword: '123', newPassword: '1234' })
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('Object');
					res.body.message.should.be.equal('Password successfully updated');
					done();
				});
		});
		it(`should return 302 after logout`, (done) => {
			request(server)
				.post('/logout')
				.set('X-Token', token)
				.end((err, res) => {
					res.should.have.status(302);
					done();
				});
		});
		it(`should return user data`, (done) => {
			request(server)
				.post('/login')
				.send({ username: 'user', password: '1234' })
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('Object');
					res.body.username.should.be.equal('user');
					res.body.email.should.be.equal('user@email.com');
					res.body.token.should.be.a('string');
					token = res.body.token;
					done();
				});
		});
	});

	describe('Only auth users have access', () => {
		it(`should return 200`, (done) => {
			request(server)
				.get('/profile')
				.set('X-Token', token)
				.end((err, res) => {
					res.should.have.status(200);
					done();
				});
		});
		it(`should return 302 after logout`, (done) => {
			request(server)
				.post('/logout')
				.set('X-Token', token)
				.end((err, res) => {
					res.should.have.status(302);
					done();
				});
		});
		it(`should return 302`, (done) => {
			request(server)
				.get('/profile')
				.end((err, res) => {
					res.should.have.status(302);
					done();
				});
		});
	});
});
