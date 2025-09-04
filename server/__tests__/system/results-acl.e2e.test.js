const request = require('supertest');
const mongoose = require('mongoose');
const path = require('path');
let app;
const { setupMemoryServer, teardownMemoryServer } = require('./testUtils');

// Mock analysis controller to avoid Python dependency
jest.doMock('../../src/controller/analysisController', () => {
  const Result = require('../../src/model/Result');
  return {
    analyzeMRI: async (req, res) => {
      const result = new Result({
        originalImage: 'x.jpg',
        prediction: 'meningioma',
        confidence: 0.8,
        userId: req.userId,
      });
      await result.save();
      return res.json({ message: 'ok', result: { prediction: 'meningioma', confidence: 0.8 }, resultId: result._id });
    },
  };
});

describe('Results API ACL (e2e)', () => {
  let tokenA, tokenB, resultIdA;

  beforeAll(async () => {
    await setupMemoryServer();
    app = require('../../app');

    // User A
    await request(app).post('/api/auth/register').send({ name: 'A', email: 'a@a.com', password: 'secret123' }).expect(201);
    const loginA = await request(app).post('/api/auth/login').send({ email: 'a@a.com', password: 'secret123' }).expect(200);
    tokenA = loginA.body.token;

    // User B
    await request(app).post('/api/auth/register').send({ name: 'B', email: 'b@b.com', password: 'secret123' }).expect(201);
    const loginB = await request(app).post('/api/auth/login').send({ email: 'b@b.com', password: 'secret123' }).expect(200);
    tokenB = loginB.body.token;

    // User A analyzes an image and gets a result
    const imgPath = path.join(__dirname, 'fixtures', 'normal.jpg');
    const analyzeA = await request(app)
      .post('/api/analyze')
      .set('Authorization', `Bearer ${tokenA}`)
      .attach('image', imgPath)
      .expect(200);
    resultIdA = analyzeA.body.resultId;
  });

  afterAll(async () => {
    await teardownMemoryServer();
  });

  test('User B cannot access User A result (403)', async () => {
    const res = await request(app)
      .get(`/api/results/${resultIdA}`)
      .set('Authorization', `Bearer ${tokenB}`)
      .expect(403);
    expect(res.body.success).toBe(false);
  });

  test('Requesting nonexistent result returns 404', async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const res = await request(app)
      .get(`/api/results/${fakeId}`)
      .set('Authorization', `Bearer ${tokenA}`)
      .expect(404);
    expect(res.body.success).toBe(false);
  });
});
