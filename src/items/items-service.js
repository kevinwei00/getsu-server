const ItemsService = {
  getAllItems(db, user_id) {
    return db
      .select(
        'item_id',
        'item_name',
        'max_quantity',
        'quantity',
        'unit_type',
        'expiration_date',
        'is_deleted'
      )
      .from('items')
      .join('users_items', 'users_items.item_id', 'items.id')
      .join('users', 'users.id', 'users_items.user_id')
      .where('user_id', user_id);
  },

  getItem(db, item_id) {
    return db
      .select(
        'item_id',
        'item_name',
        'max_quantity',
        'quantity',
        'unit_type',
        'expiration_date',
        'is_deleted'
      )
      .from('items')
      .join('users_items', 'users_items.item_id', 'items.id')
      .join('users', 'users.id', 'users_items.user_id')
      .where('item_id', item_id)
      .first();
  },

  createItem(db, item, user_id) {
    let _item;
    return db
      .insert(item)
      .into('items')
      .returning('*')
      .then((rows) => {
        _item = rows[0];
        // insert posting user into intermediate table (linking user and item)
        return db
          .insert({
            user_id,
            item_id: rows[0].id,
          })
          .into('users_items');
      })
      .then(() => {
        return _item;
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
