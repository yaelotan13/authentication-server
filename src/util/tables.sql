CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    user_email VARCHAR (200) NOT NULL,
    user_password VARCHAR (100) NOT NULL,
    user_name VARCHAR (200) NOT NULL,
);

CREATE TABLE IF NOT EXISTS sessions (
    session_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users (user_id),
    token VARCHAR (200) NOT NULL,
    expiration_date timestamp NOT NULL
);