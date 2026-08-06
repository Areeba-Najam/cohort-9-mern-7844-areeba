process.env.JWT_SECRET = 'test_secret_key';
process.env.JWT_EXPIRES_IN = '1h';
process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = chai;
chai.use(chaiHttp);

const { connect, closeDatabase, clearDatabase } = require('./helpers/testDb');
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
  });

  describe('GET /api/auth/me', () => {
    it('returns the current user when a valid token is provided', async () => {
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

    it('returns 401 when no token is provided', async () => {
      const res = await chai.request(app).get('/api/auth/me');

      expect(res).to.have.status(401);
      expect(res.body.success).to.be.false;
    });

    it('returns 401 for an invalid token', async () => {
      const res = await chai
        .request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid.token.here');

      expect(res).to.have.status(401);
    });
  });
});