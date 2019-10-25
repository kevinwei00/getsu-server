const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

function mockUsers() {
  return [
    {
      id: '53d25d5f-a033-40b3-a253-84172a514973',
      user_name: 'test-user-1',
      password: 'password',
      // time_created: new Date('2020-01-01T00:00:00.000Z'),
    },
    {
      id: 'cc5fe585-8682-4499-a04e-6255b42116c1',
      user_name: 'test-user-2',
      password: 'password',
      // time_created: new Date('2020-01-01T00:00:00.000Z'),
    },
  ];
}

function mockItems() {
  return [
    {
      id: '886d1fdb-df90-4721-b7c8-161e0166e44b',
      item_name: 'test-item-1',
      max_quantity: 10,
      quantity: 10,
      unit_type: 'units',
      expiration_date: '1000-01-01T04:56:02.000Z',
      // time_created: new Date('2020-01-01T00:00:00.000Z'),
      is_deleted: false,
    },
    {
      id: '42b12d80-7fbf-4920-9435-41d7d6523f9c',
      item_name: 'test-item-2',
      max_quantity: 10,
      quantity: 10,
      unit_type: 'units',
      expiration_date: '3000-01-01T04:56:02.000Z',
      // time_created: new Date('2020-01-01T00:00:00.000Z'),
      is_deleted: false,
    },
  ];
}

function mockRelations() {
  return [
    {
      user_id: '53d25d5f-a033-40b3-a253-84172a514973',
      item_id: '886d1fdb-df90-4721-b7c8-161e0166e44b',
    },
    {
      user_id: 'cc5fe585-8682-4499-a04e-6255b42116c1',
      item_id: '42b12d80-7fbf-4920-9435-41d7d6523f9c',
    },
  ];
}

function truncateAllTables(db) {
  return db.raw(
    `TRUNCATE
      users_items,
      users,
      items
      RESTART IDENTITY CASCADE;`
  );
}

function seedUsers(db, users) {
  const usersWithEncryptedPasswords = users.map((user) => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1),
  }));
  return db.insert(usersWithEncryptedPasswords).into('users');
}

function seedItems(db, items, relations) {
  return db.transaction(async (trx) => {
    await trx.insert(items).into('items');
    await trx.insert(relations).into('users_items');
  });
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.user_name,
    algorithm: 'HS256',
  });
  return `Bearer ${token}`;
}

module.exports = {
  mockUsers,
  mockItems,
  mockRelations,
  truncateAllTables,
  seedUsers,
  seedItems,
  makeAuthHeader,
};
