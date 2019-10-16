const ItemsService = {
  getAllItems(db) {
    return db.select('*').from('items');
  },

  getItem(db, id) {
    return db
      .select('*')
      .from('items')
      .where('id', id)
      .first();
  },

  createItem(db, item) {
    return db
      .insert(item)
      .into('items')
      .returning('*')
      .then((rows) => {
        return rows[0];
      });
  },

  updateItem(db, id, updateFields) {
    return db
      .select('*')
      .from('items')
      .where('id', id)
      .update(updateFields);
  },

  deleteItem(db, id) {
    return db
      .select('*')
      .from('items')
      .where('id', id)
      .update({ is_deleted: true });
    // .delete();
  },
};

module.exports = ItemsService;
