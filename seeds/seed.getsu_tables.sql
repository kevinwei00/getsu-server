BEGIN;

TRUNCATE
  users_items,
  users,
  items
  RESTART IDENTITY CASCADE;

INSERT INTO items 
  (item_name, max_quantity, quantity, unit_type, expiration_date, id)
VALUES
  ('Rotten Eggs', 20, 12, 'unit', '6/6/2000', 'ac565e23-273d-4d07-adc7-769863ec7344'),
  ('Salmon', 5, 5, 'lbs', '1/15/2019', '5c3973b9-f8f6-4002-8fd8-7f53ec56a8cb'),
  ('Tilapia', 16, 16, 'pieces', '3/7/2019', '05ce5573-38ae-45ac-ab00-72fa609c40ef'),
  ('Tuna', 1000, 1000, 'grams', '5/30/2019', '9ce05028-159c-4e08-9341-73291bf01e09'),
  ('Toilet Paper', 430, 430, 'rolls', '7/18/2019', '595a2822-b772-49d9-8a7d-6c81fe237500'),
  ('Ammunition', 24, 24, 'boxes', '9/24/2019', '90f47e2c-150e-46eb-b4da-a97219346de6'),
  ('Cod', 1, 0, 'fish', '12/2/2019', '771527df-c44b-4a91-b2f7-7f361b42f7e6');

INSERT INTO users
  (user_name, password, id)
VALUES
  ('loretta', '$2a$12$lHK6LVpc15/ZROZcKU00QeiD.RyYq5dVlV/9m4kKYbGibkRc5l4Ne', 'b8f2c19d-b1e4-4b57-adeb-c4236d5c197e'),
  ('walter', '$2a$12$VQ5HgWm34QQK2rJyLc0lmu59cy2jcZiV6U1.bE8rBBnC9VxDf/YQO', 'f89e98d9-2f90-4a17-886e-70fa6dc859ac'),
  ('jesse', '$2a$12$2fv9OPgM07xGnhDbyL6xsuAeQjAYpZx/3V2dnu0XNIR27gTeiK2gK', 'ad02fdc7-739b-4967-81aa-e925e11e434c'),
  ('hector', '$2a$12$/4P5/ylaB7qur/McgrEKwuCy.3JZ6W.cRtqxiJsYCdhr89V4Z3rp.', '03536074-4ad1-4f01-92c3-02226a189dba');
  
INSERT INTO users_items 
  (user_id, item_id)
VALUES
  ('b8f2c19d-b1e4-4b57-adeb-c4236d5c197e', 'ac565e23-273d-4d07-adc7-769863ec7344'),
  ('b8f2c19d-b1e4-4b57-adeb-c4236d5c197e', '5c3973b9-f8f6-4002-8fd8-7f53ec56a8cb'),
  ('f89e98d9-2f90-4a17-886e-70fa6dc859ac', '05ce5573-38ae-45ac-ab00-72fa609c40ef'),
  ('f89e98d9-2f90-4a17-886e-70fa6dc859ac', '9ce05028-159c-4e08-9341-73291bf01e09'),
  ('ad02fdc7-739b-4967-81aa-e925e11e434c', '595a2822-b772-49d9-8a7d-6c81fe237500'),
  ('ad02fdc7-739b-4967-81aa-e925e11e434c', '90f47e2c-150e-46eb-b4da-a97219346de6'),
  ('03536074-4ad1-4f01-92c3-02226a189dba', '771527df-c44b-4a91-b2f7-7f361b42f7e6');

COMMIT;
