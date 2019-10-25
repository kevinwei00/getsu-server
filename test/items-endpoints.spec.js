const knex = require('knex');
const app = require('../src/app');
const TestHelpers = require('./test-helpers');

describe('Items Endpoints', function() {
  let db;
  const mockUsers = TestHelpers.mockUsers();
  const mockItems = TestHelpers.mockItems();
  const mockRelations = TestHelpers.mockRelations();
  const endpointPath = '/api/items';

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
    GET /api/items
  ******************************************************************/
  describe(`GET ${endpointPath}`, () => {
    beforeEach('insert users', () => TestHelpers.seedUsers(db, mockUsers));

    context('Given no items in the database', () => {
      it('responds 200 and an empty list', () => {
        return supertest(app)
          .get(endpointPath)
          .set('Authorization', TestHelpers.makeAuthHeader(mockUsers[0]))
          .expect(200, []);
      });
    });

    context('Given there are items in the database', () => {
      beforeEach('insert items', () =>
        TestHelpers.seedItems(db, mockItems, mockRelations)
      );

      it('responds 200 and an array of all items', () => {
        // must set item_id to id (named differently after selecting from joined tables)
        const expectedItems = mockItems.map((item) => {
          const {
            expiration_date,
            is_deleted,
            id,
            item_name,
            max_quantity,
            quantity,
            unit_type,
          } = item;
          // order matters...
          return {
            item_id: id,
            item_name,
            max_quantity,
            quantity,
            unit_type,
            expiration_date,
            is_deleted,
          };
        });
        return supertest(app)
          .get(endpointPath)
          .set('Authorization', TestHelpers.makeAuthHeader(mockUsers[0]))
          .expect(200, [expectedItems[0]]); // wrap back into array
      });
    });
  });

  /*****************************************************************
    GET /api/items/:item_id
  ******************************************************************/
  describe(`GET ${endpointPath}/:item_id`, () => {
    beforeEach('insert users', () => TestHelpers.seedUsers(db, mockUsers));

    context('Given no items in the database', () => {
      const expectedMsg = 'Item does not exist';
      it(`responds 404 "${expectedMsg}"`, () => {
        const item_id = '886d1fdb-df90-4721-b7c8-161e0166e44b';
        return supertest(app)
          .get(`${endpointPath}/${item_id}`)
          .set('Authorization', TestHelpers.makeAuthHeader(mockUsers[0]))
          .expect(404, { error: { message: expectedMsg } });
      });
    });

    context('Given there are items in the database', () => {
      beforeEach('insert items', () =>
        TestHelpers.seedItems(db, mockItems, mockRelations)
      );

      it('responds 200 and the specified item', () => {
        // must set item_id to id (named differently after selecting from joined tables)
        const {
          expiration_date,
          is_deleted,
          id,
          item_name,
          max_quantity,
          quantity,
          unit_type,
        } = mockItems[0];
        const expectedItem = {
          expiration_date,
          is_deleted,
          item_id: id,
          item_name,
          max_quantity,
          quantity,
          unit_type,
        };
        return supertest(app)
          .get(`${endpointPath}/${id}`)
          .set('Authorization', TestHelpers.makeAuthHeader(mockUsers[0]))
          .expect(200, expectedItem);
      });
    });
  });
});
