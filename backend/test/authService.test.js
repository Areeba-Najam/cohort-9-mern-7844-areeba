process.env.JWT_SECRET = 'test_secret_key';
process.env.JWT_EXPIRES_IN = '1h';

const { expect } = require('chai');
const jwt = require('jsonwebtoken');
const { connect, closeDatabase, clearDatabase } = require('./helpers/testDb');
const authService = require('../src/services/authService');
const User = require('../src/models/User');

describe('authService', () => {
  before(async () => {
    await connect();
  });

  afterEach(async () => {
    await clearDatabase();
  });

  after(async () => {
    await closeDatabase();
  });

  describe('registerUser', () => {
    it('creates a new user with a hashed password', async () => {
      const { user, token } = await authService.registerUser({
        name: 'Areeba Najam',
        email: 'areeba@example.com',
        password: 'password123',
      });

      expect(user).to.exist;
      expect(user.email).to.equal('areeba@example.com');
      expect(user.password).to.not.equal('password123');
      expect(token).to.be.a('string');

      const savedUser = await User.findOne({ email: 'areeba@example.com' }).select('+password');
      expect(savedUser.password).to.not.equal('password123');
    });

    it('throws when the email is already registered', async () => {
      await authService.registerUser({
        name: 'First User',
        email: 'duplicate@example.com',
        password: 'password123',
      });

      try {
        await authService.registerUser({
          name: 'Second User',
          email: 'duplicate@example.com',
          password: 'password456',
        });
        expect.fail('Expected registerUser to throw for duplicate email');
      } catch (err) {
        expect(err.statusCode).to.equal(409);
        expect(err.message).to.match(/already exists/i);
      }
    });
  });

  describe('loginUser', () => {
    beforeEach(async () => {
      await authService.registerUser({
        name: 'Login Test',
        email: 'login@example.com',
        password: 'correctPassword',
      });
    });

    it('Returns a valid token for correct credentials', async () => {
      const { user, token } = await authService.loginUser({
        email: 'login@example.com',
        password: 'correctPassword',
      });

      expect(user.email).to.equal('login@example.com');

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      expect(decoded).to.have.property('id');
      expect(String(decoded.id)).to.equal(String(user._id));
    });

    it('Throws for a non-existent email', async () => {
      try {
        await authService.loginUser({
          email: 'nobody@example.com',
          password: 'whatever',
        });
        expect.fail('Expected login User to throw for unknown email');
      } catch (err) {
        expect(err.statusCode).to.equal(401);
        expect(err.message).to.match(/invalid email or password/i);
      }
    });

    it('Throws for an incorrect password', async () => {
      try {
        await authService.loginUser({
          email: 'login@example.com',
          password: 'wrongPassword',
        });
        expect.fail('Expected login User to throw for wrong password');
      } catch (err) {
        expect(err.statusCode).to.equal(401);
        expect(err.message).to.match(/invalid email or password/i);
      }
    });
  });
    describe('changePassword', () => {
    it('Changes the password when current password is correct', async () => {
      const { user } = await authService.registerUser({
        name: 'Change Flow',
        email: 'changeflow@example.com',
        password: 'startPassword',
      });

      await authService.changePassword(user._id, 'startPassword', 'endPassword');

      const { token } = await authService.loginUser({
        email: 'changeflow@example.com',
        password: 'endPassword',
      });
      expect(token).to.be.a('string');
    });

    it('Throws when current password is incorrect', async () => {
      const { user } = await authService.registerUser({
        name: 'Change Flow 2',
        email: 'changeflow2@example.com',
        password: 'startPassword',
      });

      try {
        await authService.changePassword(user._id, 'wrongPassword', 'endPassword');
        expect.fail('Expected changePassword to throw for wrong current password');
      } catch (err) {
        expect(err.statusCode).to.equal(401);
      }
    });
  });

  describe('registerUser — ValidationError branch', () => {
    it('Throws a 400 AppError when Mongoose validation fails', async () => {
      try {
        await authService.registerUser({
          name: 'A', // fails minlength: 2 on User model
          email: 'shortname@example.com',
          password: 'password123',
        });
        expect.fail('Expected registerUser to throw a validation error');
      } catch (err) {
        expect(err.statusCode).to.equal(400);
      }
    });
  });
});