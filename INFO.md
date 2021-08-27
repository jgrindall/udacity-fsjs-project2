SETUP
----



NOTES:
----

1. 




API:
----

    /api/images:
        get:
            description: Gets a resized image
            parameters:
                filename:
                    required: true
                    type: string
                    description: The name of the image
                    in: query
                width:
                    required: true
                    type: number in [1...2048]
                    description: The desired width
                    in: query
                height:
                    required: true
                    type: number in [1...2048]
                    description: The desired height
                    in: query
            produces:
                image/jpg  
            responses:
                200: description: OK (returned from cache)
                201: description: OK (created new image)
                422: description: Incorrect input
                500: description: Error (file not found)
   






DATABASE TABLES:
----
 users
 
 
CREATE TABLE public.users
(
    id integer NOT NULL DEFAULT nextval('users_id_seq'::regclass),
    "firstName" character varying(64) COLLATE pg_catalog."default",
    "lastName" character varying(64) COLLATE pg_catalog."default",
    password character varying(1024) COLLATE pg_catalog."default",
    CONSTRAINT users_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE public.users
    OWNER to postgres_udacity;
 
 products
 
 
CREATE TABLE public.products
(
    id integer NOT NULL DEFAULT nextval('products_id_seq'::regclass),
    name character varying(64) COLLATE pg_catalog."default",
    price integer,
    category character varying(64) COLLATE pg_catalog."default",
    CONSTRAINT products_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE public.products
    OWNER to postgres_udacity;
 
 orders
 
 
CREATE TABLE public.orders
(
    id integer NOT NULL DEFAULT nextval('orders_id_seq'::regclass),
    status character varying(32) COLLATE pg_catalog."default",
    user_id integer,
    CONSTRAINT orders_pkey PRIMARY KEY (id),
    CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE public.orders
    OWNER to postgres_udacity;
 
 order_products
 
 
CREATE TABLE public.order_products
(
    id integer NOT NULL DEFAULT nextval('order_products_id_seq'::regclass),
    quantity integer,
    order_id integer,
    product_id integer,
    CONSTRAINT order_products_pkey PRIMARY KEY (id),
    CONSTRAINT order_products_order_id_fkey FOREIGN KEY (order_id)
        REFERENCES public.orders (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT order_products_product_id_fkey FOREIGN KEY (product_id)
        REFERENCES public.products (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)


