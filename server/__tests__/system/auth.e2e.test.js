const request = require('supertest');
let app;
const { setupMemoryServer, teardownMemoryServer } = require('./testUtils');

describe('Auth API (e2e)', () => {
  beforeAll(async () => {
  await setupMemoryServer();
  // import app after DB is configured
  app = require('../../app');
  });

  afterAll(async () => {
    await teardownMemoryServer();
  });

  test('register -> login -> get current user', async () => {
    // register
    const reg = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Alice', email: 'alice@example.com', password: 'secret123', userType: 'patient' })
      .expect(201);

    expect(reg.body.success).toBe(true);
    expect(reg.body.token).toBeDefined();

    // login
    const login = await request(app)
      .post('/api/auth/login')
      .send({ email: 'alice@example.com', password: 'secret123' })
      .expect(200);

    const token = login.body.token;
    expect(token).toBeDefined();

    // get current user
    const me = await request(app)
      .get('/api/auth/user')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(me.body.success).toBe(true);
    expect(me.body.user.email).toBe('alice@example.com');
  });

  test('login fails with wrong password', async () => {
    // Create user first
    await request(app)
      .post('/api/auth/register')
      .send({ name: 'Bob', email: 'bob@example.com', password: 'secret123', userType: 'healthcare' })
      .expect(201);

    const bad = await request(app)
      .post('/api/auth/login')
      .send({ email: 'bob@example.com', password: 'nope' })
      .expect(401);

    expect(bad.body.success).toBe(false);
  });

  test('duplicate registration is rejected', async () => {
    // First registration
    await request(app)
      .post('/api/auth/register')
      .send({ name: 'Dup', email: 'dup@example.com', password: 'secret123', userType: 'patient' })
      .expect(201);

    // Duplicate registration
    const dup = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Dup2', email: 'dup@example.com', password: 'secret123', userType: 'patient' })
      .expect(400);

    expect(dup.body.success).toBe(false);
    expect(dup.body.message).toMatch(/already registered/i);
  });
});
