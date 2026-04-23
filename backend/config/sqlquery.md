CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(60) NOT NULL CHECK (char_length(name) BETWEEN 20 AND 60),
  email VARCHAR(100) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  address VARCHAR(400),
  role VARCHAR(10) CHECK (role IN ('admin','user','owner')) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE stores (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100),
  address VARCHAR(400),
  owner_id INTEGER REFERENCES users(id)
);

CREATE TABLE ratings (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  store_id INTEGER REFERENCES stores(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  UNIQUE(user_id, store_id)
);