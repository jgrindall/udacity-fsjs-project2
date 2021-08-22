create table order_products(
                               id SERIAL PRIMARY KEY,
                               quantity int,
                               order_id int references orders(id) on delete cascade,
                               product_id int references products(id) on delete cascade
);