const knex = require('knex');
// const jwt = require('jsonwebtoken');
const app = require('../src/app');
const AuthService = require('../src/auth/auth-service');
const TestHelpers = require('./test-helpers');

describe('Authentication Endpoints', function() {
  let db;
  const mockUsers = TestHelpers.mockUsers();
  const testUser = mockUsers[0];
  const endpointPath = '/api/auth/login';

  /*****************************************************************
    SETUP
  ******************************************************************/
  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set('db', db);
  });

  before('cleanup', () => TestHelpers.truncateAllTables(db));

  afterEach('cleanup', () => TestHelpers.truncateAllTables(db));

  after('disconnect from db', () => db.destroy());

  /*****************************************************************
    POST /api/auth/login
  ******************************************************************/
  describe(`POST ${endpointPath}`, () => {
    beforeEach('insert users', () => TestHelpers.seedUsers(db, mockUsers));

    const requiredFields = ['user_name', 'password'];
    requiredFields.forEach((field) => {
      const loginAttemptBody = {
        user_name: testUser.user_name,
        password: testUser.password,
      };

      const expectedMsg1 = `Missing '${field}' in request body`;
      it(`responds 400 "${expectedMsg1}" when '${field}' is missing`, () => {
        delete loginAttemptBody[field];

        return supertest(app)
          .post(endpointPath)
          .send(loginAttemptBody)
          .expect(400, { error: expectedMsg1 });
      });
    });

    const expectedMsg2 = 'Incorrect user_name or password';
    it(`responds 400 "${expectedMsg2}" when bad user_name`, () => {
      const testLogin = { user_name: 'nonexistent-user', password: 'password' };
      return supertest(app)
        .post(endpointPath)
        .send(testLogin)
        .expect(400, { error: expectedMsg2 });
    });

    it(`responds 400 "${expectedMsg2}" when bad password`, () => {
      const testLogin = { user_name: testUser.user_name, password: 'incorrect' };
      return supertest(app)
        .post(endpointPath)
        .send(testLogin)
        .expect(400, { error: expectedMsg2 });
    });

    it('responds 200 and JWT auth token using secret when valid login', () => {
      const testLogin = { user_name: testUser.user_name, password: testUser.password };
      const subject = testUser.user_name;
      const payload = { user_id: testUser.id };
      return supertest(app)
        .post(endpointPath)
        .send(testLogin)
        .expect(200, { authToken: AuthService.createJwt(subject, payload) });
    });
  });
});
