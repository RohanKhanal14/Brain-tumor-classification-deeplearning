const { analyzeMRI } = require('../../src/controller/analysisController');
const Result = require('../../src/model/Result');

jest.mock('child_process', () => ({
  spawn: () => {
    const { EventEmitter } = require('events');
    const stdout = new EventEmitter();
    const stderr = new EventEmitter();
    const proc = new EventEmitter();
    proc.stdout = stdout;
    proc.stderr = stderr;
    process.nextTick(() => {
      stdout.emit('data', Buffer.from('Some logs...'));
      stdout.emit('data', Buffer.from('\n'));
      stdout.emit('data', Buffer.from(JSON.stringify({ prediction: 'no_tumor', confidence: 0.77 })));
      proc.emit('close', 0);
    });
    return proc;
  },
}));

jest.mock('../../src/model/Result');

function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe('analyzeMRI controller', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns 400 when no file', async () => {
    const req = { file: null };
    const res = mockRes();
    await analyzeMRI(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('saves result and returns prediction on success', async () => {
    const req = {
      file: { path: '/tmp/file.jpg', filename: 'file.jpg' },
      body: { patientName: 'A' },
      userId: '507f1f77bcf86cd799439011',
    };
    const res = mockRes();

    Result.mockImplementation(() => ({ save: jest.fn() }));

    await new Promise((resolve) => {
      res.json = jest.fn(() => resolve());
      analyzeMRI(req, res);
    });

    expect(res.json).toHaveBeenCalled();
    const payload = res.json.mock.calls[0][0];
    expect(payload.result.prediction).toBeDefined();
  });
});
