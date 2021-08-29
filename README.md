

# Notes

I have made the following decisions:

1. on delete cascade
    - To avoid issues with adding/removing products and orders, I opted to delete all orders belonging to a user when the user is deleted

2. only one active order per customer
    - The spec says to return the 'current' order for a user. I interpreted this as meaning that any user is only allowed one active order at any time.

3. username
    - Users have a firstName and lastName but in my app they login using firstName + " " + lastName as their "username"

4. authentication
    - Any valid token will allow any user access to any resource. 
    - Presumably in reality we would limit users to only access their data but there is nothing in the spec about roles (admin can create users?) or details about how this should work
                                                                                   

# Setup

- I have committed the .env file to git which is probably insecure but it allows easy testing
    
- My app requires a database to be created called 'udacity_fsjs_project2'

 - To buld and run the app
    
    - npm i
    - npm run build
    - npm run prod

- The unit tests will be run on a database called 'udacity_fsjs_project2_test'
    
    - npm run test
    
- Both databases should belong to a user:

    - username: 'postgres_udacity'
    - password: 'p0stgres' (zero in place of o)

Before running the app or tests please ensure this user exists.

I created my user in pgadmin (see <a href="./users.png">users.png</a>)

Alternatively, use the SQL

```
CREATE ROLE postgres_udacity WITH
	LOGIN
	NOSUPERUSER
	CREATEDB
	NOCREATEROLE
	INHERIT
	NOREPLICATION
	CONNECTION LIMIT -1
	PASSWORD 'xxxxxx';



# Postman tests

- I have included an export of Postman requests. 
- See the file .../json



# Database Schema:
 
 - users
    
    - <ins><b>id</b></ins> integer primary key
    - firstName varchar(64)
    - lastName varchar(64)
    - password varchar(1024) - encrypted password
 
 
 - products

    - <ins><b>id</b></ins> integer primary key
    - name varchar(64)
    - price integer
    - category varchar(64)

 
 - orders
    
    - <ins><b>id</b></ins> integer primary key
    - status varchar(32)
    - user_id foreign key references users.id - on delete cascade
   
 - order_products
    
    - <ins><b>id</b></ins> integer primary key
    - quantity integer
    - <ins><b>order_id</b></ins> integer foreign key references orders.id  - on delete cascade
    - <ins><b>product_id</b></ins> integer foreign key references products.id  - on delete cascade
        


For details of the API please see <a href="./API.yaml">API.yaml</a>


