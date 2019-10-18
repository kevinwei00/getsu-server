CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  item_name VARCHAR(64) NOT NULL,
  max_quantity REAL NOT NULL,
  quantity REAL NOT NULL,
  unit_type VARCHAR(16) NOT NULL,
  expiration_date DATE,
  time_created TIMESTAMP NOT NULL DEFAULT now(),
  is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);