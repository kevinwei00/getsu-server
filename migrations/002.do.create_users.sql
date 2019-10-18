CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_name VARCHAR(64) NOT NULL,
  password VARCHAR(128) NOT NULL,
  time_created TIMESTAMP NOT NULL DEFAULT now()
);