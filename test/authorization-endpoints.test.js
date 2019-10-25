const knex = require('knex');
const app = require('../src/app');
const TestHelpers = require('./test-helpers');

describe('Authorization Endpoints', function() {
  let db;
  const mockUsers = TestHelpers.mockUsers();
  const mockItems = TestHelpers.mockItems();
  const mockRelations = TestHelpers.mockRelations();

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
    test all protected endpoints
  ******************************************************************/
  beforeEach('insert users', () => TestHelpers.seedUsers(db, mockUsers));
  beforeEach('insert items', () => TestHelpers.seedItems(db, mockItems, mockRelations));

  const authorizationEndpoints = [
    {
      name: 'GET /api/items',
      path: '/api/items',
      method: supertest(app).get,
    },
    {
      name: 'POST /api/items',
      path: '/api/items',
      method: supertest(app).post,
    },
    {
      name: 'GET /api/items/:item_id',
      path: '/api/items/886d1fdb-df90-4721-b7c8-161e0166e44b',
      method: supertest(app).get,
    },
    {
      name: 'DELETE /api/items/:item_id',
      path: '/api/items/886d1fdb-df90-4721-b7c8-161e0166e44b',
      method: supertest(app).delete,
    },
    {
      name: 'PATCH /api/items/:item_id',
      path: '/api/items/886d1fdb-df90-4721-b7c8-161e0166e44b',
      method: supertest(app).patch,
    },
  ];

  const expectedMsg1 = 'Missing bearer token';
  const expectedMsg2 = 'Unauthorized request';
  authorizationEndpoints.forEach((endpoint) => {
    describe(endpoint.name, () => {
      it(`responds 401 "${expectedMsg1}" when no bearer token`, () => {
        return endpoint.method(endpoint.path).expect(401, { error: expectedMsg1 });
      });

      it(`responds 401 "${expectedMsg2}" when invalid JWT secret`, () => {
        const validUser = mockUsers[0];
        const invalidSecret = 'bad-secret';
        return endpoint
          .method(endpoint.path)
          .set('Authorization', TestHelpers.makeAuthHeader(validUser, invalidSecret))
          .expect(401, { error: expectedMsg2 });
      });

      it(`responds 401 "${expectedMsg2}" when invalid payload subject`, () => {
        const invalidUser = { user_name: 'user-not-existy', id: 1 };
        return endpoint
          .method(endpoint.path)
          .set('Authorization', TestHelpers.makeAuthHeader(invalidUser))
          .expect(401, { error: expectedMsg2 });
      });
    });
  });
});
