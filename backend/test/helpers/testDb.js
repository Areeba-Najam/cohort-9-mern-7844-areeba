require('dotenv').config();
const mongoose = require('mongoose');

const connect = async () => {
  const uri = process.env.MONGODB_URI_TEST;

  if (!uri) {
    throw new Error('MONGODB_URI_TEST is not set add it to your .env file');
  }

  if (!uri.includes('-test')) {
    throw new Error('Refusing to run tests against a non-test database. Check MONGODB_URI_TEST.');
  }

  await mongoose.connect(uri);
};

const closeDatabase = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
};

const clearDatabase = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
};

module.exports = { connect, closeDatabase, clearDatabase };