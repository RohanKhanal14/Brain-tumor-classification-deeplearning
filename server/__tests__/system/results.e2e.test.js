const request = require('supertest');
const path = require('path');
const fs = require('fs');
let app;
const { setupMemoryServer, teardownMemoryServer } = require('./testUtils');

jest.setTimeout(60000);

describe('Results API (e2e)', () => {
  let token;

  beforeAll(async () => {
    await setupMemoryServer();
    // Mock analysisController BEFORE loading the app so routes use the mock
    jest.doMock('../../src/controller/analysisController', () => {
      const Result = require('../../src/model/Result');
      return {
        analyzeMRI: async (req, res) => {
          if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
          const result = new Result({
            originalImage: req.file.filename || 'test.jpg',
            prediction: 'glioma',
            confidence: 0.92,
            patientName: req.body.patientName || '',
            patientAge: req.body.patientAge || '',
            patientGender: req.body.patientGender || '',
            scanDate: req.body.scanDate || '',
            userId: req.userId,
          });
          await result.save();
          return res.json({
            message: 'Analysis complete',
            result: { prediction: 'glioma', confidence: 0.92 },
            resultId: result._id,
            patientData: {
              patientName: result.patientName,
              patientAge: result.patientAge,
              patientGender: result.patientGender,
              scanDate: result.scanDate,
            },
          });
        },
      };
    });
    app = require('../../app');

    // ensure uploads dir exists
    const uploads = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploads)) fs.mkdirSync(uploads, { recursive: true });

  // register and login
    await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test', email: 't@t.com', password: 'secret123', userType: 'patient' })
      .expect(201);

    const login = await request(app)
      .post('/api/auth/login')
      .send({ email: 't@t.com', password: 'secret123' })
      .expect(200);

  token = login.body.token;
  });

  afterAll(async () => {
    await teardownMemoryServer();
  });

  test('analyze image and then list results and get by id', async () => {
    const imgPath = path.join(__dirname, 'fixtures', 'normal.jpg');
    // create a tiny dummy file to upload
    const fixturesDir = path.dirname(imgPath);
    if (!fs.existsSync(fixturesDir)) fs.mkdirSync(fixturesDir, { recursive: true });
    if (!fs.existsSync(imgPath)) fs.writeFileSync(imgPath, 'fakeimage');

    const analyze = await request(app)
      .post('/api/analyze')
      .set('Authorization', `Bearer ${token}`)
      .attach('image', imgPath)
      .field('patientName', 'John Doe')
      .field('patientAge', '42')
      .field('patientGender', 'M')
      .field('scanDate', '2025-09-01')
      .expect(200);

    expect(analyze.body.result.prediction).toBeDefined();
    const resultId = analyze.body.resultId;

    const list = await request(app)
      .get('/api/results')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(Array.isArray(list.body)).toBe(true);
    expect(list.body.length).toBeGreaterThan(0);

    const getOne = await request(app)
      .get(`/api/results/${resultId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(getOne.body._id).toBe(resultId);
  });

  test('results API requires auth', async () => {
    await request(app).get('/api/results').expect(401);
  });
});
