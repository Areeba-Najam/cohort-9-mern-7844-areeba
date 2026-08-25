process.env.JWT_SECRET = 'test_secret_key';
process.env.JWT_EXPIRES_IN = '1h';
process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = chai;
chai.use(chaiHttp);

const { connect, closeDatabase, clearDatabase } = require('./helpers/testDb');
const request = require('supertest');
const app = require('../src/app');

describe('Auth API endpoints', () => {
  before(async () => {
    await connect();
  });

  afterEach(async () => {
    await clearDatabase();
  });

  after(async () => {
    await closeDatabase();
  });

  describe('POST /api/auth/register', () => {
    it('registers a new user and returns 201 with a token', async () => {
      const res = await chai.request(app).post('/api/auth/register').send({
        name: 'New User',
        email: 'newuser@example.com',
        password: 'password123',
      });

      expect(res).to.have.status(201);
      expect(res.body.success).to.be.true;
      expect(res.body.data.user.email).to.equal('newuser@example.com');
      expect(res.body.data.token).to.be.a('string');
    });

    it('returns 409 when registering a duplicate email', async () => {
      await chai.request(app).post('/api/auth/register').send({
        name: 'First',
        email: 'dupe@example.com',
        password: 'password123',
      });

      const res = await chai.request(app).post('/api/auth/register').send({
        name: 'Second',
        email: 'dupe@example.com',
        password: 'password456',
      });

      expect(res).to.have.status(409);
      expect(res.body.success).to.be.false;
    });

    it('returns 400 when missing required fields during registration', async () => {
      const res = await chai.request(app).post('/api/auth/register').send({
        email: 'incomplete@example.com',
      });

      expect(res).to.have.status(400);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await chai.request(app).post('/api/auth/register').send({
        name: 'Login User',
        email: 'loginapi@example.com',
        password: 'correctPassword',
      });
    });

    it('logs in with correct credentials and returns a token', async () => {
      const res = await chai.request(app).post('/api/auth/login').send({
        email: 'loginapi@example.com',
        password: 'correctPassword',
      });

      expect(res).to.have.status(200);
      expect(res.body.data.token).to.be.a('string');
    });

    it('returns 401 for incorrect password', async () => {
      const res = await chai.request(app).post('/api/auth/login').send({
        email: 'loginapi@example.com',
        password: 'wrongPassword',
      });

      expect(res).to.have.status(401);
      expect(res.body.success).to.be.false;
    });

    it('returns 400 when login payload is empty', async () => {
      const res = await chai.request(app).post('/api/auth/login').send({});

      expect(res).to.have.status(400);
    });
  });

  describe('GET /api/auth/me', () => {
    it('Returns the current user when a valid token is provided', async () => {
      const registerRes = await chai.request(app).post('/api/auth/register').send({
        name: 'Me User',
        email: 'meuser@example.com',
        password: 'password123',
      });

      const token = registerRes.body.data.token;

      const res = await chai
        .request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(res).to.have.status(200);
      expect(res.body.data.user.email).to.equal('meuser@example.com');
    });

    it('Returns 401 when no token is provided', async () => {
      const res = await chai.request(app).get('/api/auth/me');

      expect(res).to.have.status(401);
      expect(res.body.success).to.be.false;
    });

    it('Returns 401 for an invalid token', async () => {
      const res = await chai
        .request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid.token.here');

      expect(res).to.have.status(401);
    });
  });
    describe('PATCH /api/auth/change-password', () => {
    let token;

    beforeEach(async () => {
      const registerRes = await chai.request(app).post('/api/auth/register').send({
        name: 'Change User',
        email: 'change@example.com',
        password: 'originalPassword',
      });
      token = registerRes.body.data.token;
    });

    it('Changes the password with correct current password', async () => {
      const res = await chai
        .request(app)
        .patch('/api/auth/change-password')
        .set('Authorization', `Bearer ${token}`)
        .send({ currentPassword: 'originalPassword', newPassword: 'newPassword123' });

      expect(res).to.have.status(200);
      expect(res.body.success).to.be.true;
    });

    it('Returns 401 when current password is incorrect', async () => {
      const res = await chai
        .request(app)
        .patch('/api/auth/change-password')
        .set('Authorization', `Bearer ${token}`)
        .send({ currentPassword: 'wrongPassword', newPassword: 'newPassword123' });

      expect(res).to.have.status(401);
    });

    it('Returns 401 without a valid token', async () => {
      const res = await chai
        .request(app)
        .patch('/api/auth/change-password')
        .send({ currentPassword: 'originalPassword', newPassword: 'newPassword123' });

      expect(res).to.have.status(401);
    });

    it('Returns 400 when currentPassword is missing', async () => {
      const res = await chai
        .request(app)
        .patch('/api/auth/change-password')
        .set('Authorization', `Bearer ${token}`)
        .send({ newPassword: 'newPassword123' });

      expect(res).to.have.status(400);
    });

    it('Returns 400 when newPassword is missing', async () => {
      const res = await chai
        .request(app)
        .patch('/api/auth/change-password')
        .set('Authorization', `Bearer ${token}`)
        .send({ currentPassword: 'originalPassword' });

      expect(res).to.have.status(400);
    });
  });
});