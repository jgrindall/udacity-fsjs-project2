create table users (
       id SERIAL PRIMARY KEY,
       firstName VARCHAR(64),
       lastName VARCHAR(64),
       password_digest VARCHAR(1024)
);
