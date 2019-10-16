CREATE TABLE users_items (
  user_id uuid REFERENCES users(id),
  item_id uuid REFERENCES items(id),
  PRIMARY KEY (user_id, item_id)
);