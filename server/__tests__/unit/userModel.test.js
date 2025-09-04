const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('../../src/model/User');

describe('User model', () => {
  let mongo;

  beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    const uri = mongo.getUri();
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongo.stop();
  });

  it('hashes password on save and compares correctly', async () => {
    const user = new User({ name: 'T', email: 't@example.com', password: 'secret123', userType: 'patient' });
    await user.save();

    expect(user.password).not.toBe('secret123');
    const ok = await bcrypt.compare('secret123', user.password);
    expect(ok).toBe(true);

    const notOk = await user.comparePassword('wrong');
    expect(notOk).toBe(false);
  });
});
