create table orders(
                       id SERIAL PRIMARY KEY,
                       status varchar(32),
                       user_id int references users(id) on delete cascade
);