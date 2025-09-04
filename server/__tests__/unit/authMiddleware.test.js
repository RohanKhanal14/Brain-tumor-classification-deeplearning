const jwt = require('jsonwebtoken');
const auth = require('../../src/middleware/authMiddleware');

describe('auth middleware', () => {
  const res = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  it('rejects missing authorization header', () => {
    const req = { headers: {} };
    const response = res();
    const next = jest.fn();

    auth(req, response, next);

    expect(response.status).toHaveBeenCalledWith(401);
    expect(response.json).toHaveBeenCalledWith({ success: false, message: 'Authorization token required' });
    expect(next).not.toHaveBeenCalled();
  });

  it('rejects malformed authorization header', () => {
    const req = { headers: { authorization: 'Token abc' } };
    const response = res();
    const next = jest.fn();

    auth(req, response, next);

    expect(response.status).toHaveBeenCalledWith(401);
    expect(response.json).toHaveBeenCalledWith({ success: false, message: 'Authorization token required' });
    expect(next).not.toHaveBeenCalled();
  });

  it('accepts valid token and attaches userId', () => {
    const token = jwt.sign({ userId: '123' }, process.env.JWT_SECRET);
    const req = { headers: { authorization: `Bearer ${token}` } };
    const response = res();
    const next = jest.fn();

    auth(req, response, next);

    expect(req.userId).toBe('123');
    expect(next).toHaveBeenCalled();
  });

  it('rejects invalid token', () => {
    const req = { headers: { authorization: 'Bearer invalid.token' } };
    const response = res();
    const next = jest.fn();

    auth(req, response, next);

    expect(response.status).toHaveBeenCalledWith(401);
    expect(response.json).toHaveBeenCalledWith({ success: false, message: 'Invalid or expired token' });
    expect(next).not.toHaveBeenCalled();
  });
});
