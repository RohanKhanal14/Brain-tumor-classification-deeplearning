const request = require('supertest');
const fs = require('fs');
const path = require('path');
let app;
const { setupMemoryServer, teardownMemoryServer } = require('./testUtils');

describe('Profile API (e2e)', () => {
  let token;

  beforeAll(async () => {
    await setupMemoryServer();
    app = require('../../app');

    // register and login
    await request(app)
      .post('/api/auth/register')
      .send({ name: 'User', email: 'user@example.com', password: 'passw0rd', userType: 'patient' })
      .expect(201);

    const login = await request(app)
      .post('/api/auth/login')
      .send({ email: 'user@example.com', password: 'passw0rd' })
      .expect(200);

    token = login.body.token;
  });

  afterAll(async () => {
    await teardownMemoryServer();
  });

  test('GET /api/profile returns current profile', async () => {
    const res = await request(app)
      .get('/api/profile')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.profile.email).toBe('user@example.com');
  });

  test('PUT /api/profile updates basic fields', async () => {
    const res = await request(app)
      .put('/api/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({ fullName: 'User Updated', organization: 'Org', location: 'Earth' })
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.user.name).toBe('User Updated');
    expect(res.body.user.organization).toBe('Org');
    expect(res.body.user.location).toBe('Earth');
  });

  test('POST /api/profile/avatar uploads avatar and replaces old', async () => {
    const uploadsDir = path.join(__dirname, '../../uploads/profiles');
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
    const imgPath = path.join(__dirname, 'fixtures', 'normal.jpg');
    if (!fs.existsSync(path.dirname(imgPath))) fs.mkdirSync(path.dirname(imgPath), { recursive: true });
    if (!fs.existsSync(imgPath)) fs.writeFileSync(imgPath, 'fakeimage');

    // First upload
    const res1 = await request(app)
      .post('/api/profile/avatar')
      .set('Authorization', `Bearer ${token}`)
      .attach('avatar', imgPath)
      .expect(200);
    expect(res1.body.success).toBe(true);
    const firstUrl = res1.body.avatarUrl;
    const firstFile = path.join(__dirname, '../../', firstUrl);
    expect(fs.existsSync(firstFile)).toBe(true);

    // Second upload (should delete old)
    const res2 = await request(app)
      .post('/api/profile/avatar')
      .set('Authorization', `Bearer ${token}`)
      .attach('avatar', imgPath)
      .expect(200);
    const secondUrl = res2.body.avatarUrl;
    const secondFile = path.join(__dirname, '../../', secondUrl);
    expect(fs.existsSync(secondFile)).toBe(true);

    // Old file should be gone
    expect(fs.existsSync(firstFile)).toBe(false);
  });
});
