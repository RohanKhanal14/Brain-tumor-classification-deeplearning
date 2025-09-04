const { uploadTempFile, cleanupTempFiles } = require('../../src/controller/uploadController');
const fs = require('fs');
const path = require('path');

function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe('uploadController', () => {
  beforeEach(() => jest.spyOn(console, 'error').mockImplementation(() => {}));
  afterEach(() => jest.restoreAllMocks());

  it('returns 400 when no file in uploadTempFile', () => {
    const req = { file: null };
    const res = mockRes();
    uploadTempFile(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('returns success when file provided', () => {
    const req = { file: { filename: 'abc.jpg' } };
    const res = mockRes();
    uploadTempFile(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true, filename: 'abc.jpg' }));
  });

  it('cleanupTempFiles deletes older files beyond threshold', () => {
    const files = Array.from({ length: 25 }, (_, i) => `file_${i}.tmp`);
    jest.spyOn(fs, 'readdir').mockImplementation((dir, cb) => cb(null, files));
    jest.spyOn(fs, 'statSync').mockImplementation((filePath) => {
      const base = path.basename(filePath);
      const match = base.match(/file_(\d+)\.tmp/);
      const i = match ? parseInt(match[1], 10) : 0;
      const mtime = new Date(Date.now() - (25 - i) * 1000);
      return { mtime };
    });

    const unlinkSpy = jest.spyOn(fs, 'unlink').mockImplementation((p, cb) => cb && cb(null));

    cleanupTempFiles();

    // Should delete 5 oldest files (25 - 20)
    expect(unlinkSpy).toHaveBeenCalledTimes(5);

    fs.readdir.mockRestore();
    fs.statSync.mockRestore();
    unlinkSpy.mockRestore();
  });
});
