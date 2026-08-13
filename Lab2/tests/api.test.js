const request = require('supertest');
const app = require('../server');
const { resetDatabase, students } = require('../src/db');

/**
 * Integration test suite: exercises the full HTTP layer (routes + Express
 * middleware) using supertest, on top of the already unit-tested
 * validators and decision table logic. Resets the in-memory database
 * before each test so tests remain independent of execution order.
 */
beforeEach(() => {
  resetDatabase();
});

describe('POST /api/login', () => {
  test('rejects login when student ID is missing', async () => {
    const res = await request(app).post('/api/login').send({ studentId: '', password: 'Passw0rd' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test('rejects login when password format is invalid', async () => {
    const res = await request(app).post('/api/login').send({ studentId: '02240365', password: 'weak' });
    expect(res.status).toBe(400);
  });

  test('rejects login with wrong credentials', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ studentId: '02240365', password: 'WrongPass1' });
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  test('logs in successfully with valid credentials', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ studentId: '02240365', password: 'Passw0rd' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.student.studentId).toBe('02240365');
  });
});

describe('POST /api/register', () => {
  test('returns 404 for an unknown student', async () => {
    const res = await request(app).post('/api/register').send({ studentId: '99999999', moduleCode: 'SWE302' });
    expect(res.status).toBe(404);
  });

  test('rejects registration when tuition has not been paid', async () => {
    const res = await request(app)
      .post('/api/register')
      .send({ studentId: '02240365', moduleCode: 'SWE305' });
    expect(res.status).toBe(403);
    expect(res.body.message).toMatch(/payment not verified/i);
  });

  test('rejects duplicate module registration once eligible', async () => {
    students['02240365'].tuitionPaid = true; // simulate a verified payment
    const res = await request(app)
      .post('/api/register')
      .send({ studentId: '02240365', moduleCode: 'SWE301' }); // already registered in db.js seed data
    expect(res.status).toBe(409);
    expect(res.body.message).toMatch(/already registered/i);
  });

  test('allows registration when all conditions are satisfied', async () => {
    students['02240365'].tuitionPaid = true;
    const res = await request(app)
      .post('/api/register')
      .send({ studentId: '02240365', moduleCode: 'SWE305' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.registeredModules).toContain('SWE305');
  });
});

describe('POST /api/payment/upload', () => {
  test('rejects upload with no screenshot attached', async () => {
    const res = await request(app)
      .post('/api/payment/upload')
      .field('studentId', '02240365')
      .field('transactionNumber', '123-123456789');
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/mandatory/i);
  });

  test('rejects upload with an unsupported file type', async () => {
    const res = await request(app)
      .post('/api/payment/upload')
      .field('studentId', '02240365')
      .field('transactionNumber', '123-123456789')
      .attach('screenshot', Buffer.from('dummy'), 'proof.pdf');
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/invalid file type/i);
  });

  test('rejects upload with a malformed transaction number', async () => {
    const res = await request(app)
      .post('/api/payment/upload')
      .field('studentId', '02240365')
      .field('transactionNumber', '12-123456789')
      .attach('screenshot', Buffer.from('dummy'), 'proof.jpg');
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/format/i);
  });

  test('keeps registration incomplete when college has not verified payment (R9)', async () => {
    const res = await request(app)
      .post('/api/payment/upload')
      .field('studentId', '02240365')
      .field('transactionNumber', '123-123456789')
      .field('verifiedByCollege', 'false')
      .attach('screenshot', Buffer.from('dummy'), 'proof.jpg');
    expect(res.status).toBe(202);
    expect(res.body.success).toBe(false);
  });

  test('generates an electronic receipt once verified by the college (R8)', async () => {
    const res = await request(app)
      .post('/api/payment/upload')
      .field('studentId', '02240365')
      .field('transactionNumber', '123-123456789')
      .field('verifiedByCollege', 'true')
      .attach('screenshot', Buffer.from('dummy'), 'proof.png');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.receipt).toMatch(/^RECEIPT-123-123456789-/);
  });

  test('rejects upload when studentId does not exist', async () => {
    const res = await request(app)
      .post('/api/payment/upload')
      .field('studentId', '99999999')
      .field('transactionNumber', '123-123456789')
      .attach('screenshot', Buffer.from('dummy'), 'proof.jpg');
    expect(res.status).toBe(404);
  });
});

describe('GET /api/results/:studentId', () => {
  test('returns 404 for an unknown student', async () => {
    const res = await request(app).get('/api/results/99999999');
    expect(res.status).toBe(404);
  });

  test('denies access to a student with no registered modules', async () => {
    students['02240365'].registeredModules = [];
    const res = await request(app).get('/api/results/02240365');
    expect(res.status).toBe(403);
    expect(res.body.message).toMatch(/access denied/i);
  });

  test('returns Module Code, Module Title and Grade for a registered student', async () => {
    const res = await request(app).get('/api/results/02240365');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.results[0]).toHaveProperty('moduleCode');
    expect(res.body.results[0]).toHaveProperty('moduleTitle');
    expect(res.body.results[0]).toHaveProperty('grade');
  });
});
