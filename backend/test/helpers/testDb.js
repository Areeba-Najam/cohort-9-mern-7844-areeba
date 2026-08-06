require('dotenv').config();
const mongoose = require('mongoose');

const EXPECTED_TEST_DB_NAME = 'notes-app-test';

const getDbNameFromUri = (uri) => {
  const match = uri.match(/\/([^/?]+)(\?|$)/);
  return match ? match[1] : null;
};

const connect = async () => {
  const uri = process.env.MONGODB_URI_TEST;

  if (!uri) {
    throw new Error('MONGODB_URI_TEST is not add it to your .env file');
  }

  const dbName = getDbNameFromUri(uri);
  if (dbName !== EXPECTED_TEST_DB_NAME) {
    throw new Error(
      `Refusing to run tests: expected database "${EXPECTED_TEST_DB_NAME}", got "${dbName}". Check MONGODB_URI_TEST.`
    );
  }

  try {
    await mongoose.connect(uri);
  } catch (err) {
    throw new Error(`Failed to connect to test database: ${err.message}`);
  }
};

const closeDatabase = async () => {
  try {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  } catch (err) {
    throw new Error(`Failed to close test database cleanly: ${err.message}`);
  }
};

const clearDatabase = async () => {
  try {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  } catch (err) {
    throw new Error(`Failed to clear test database collections: ${err.message}`);
  }
};

module.exports = { connect, closeDatabase, clearDatabase };