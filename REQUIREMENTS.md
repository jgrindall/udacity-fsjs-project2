# API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application. 


See <a href="./API.yaml" target="_blank">API.yaml</a> for more details.

## API Endpoints
#### Products
- Index 
	
	/api/products/:
		get:
			description: list all available products
        
- Show

	/api/products/:id:
		get:
			description: show a product
        
- Create [token required]

	/api/products/:
		post:
			description: create a product
    
	

- [OPTIONAL] Top 5 most popular products 
- [OPTIONAL] Products by category (args: product category)

#### Users
- Index [token required]

	/api/users:
		get:
			description: list users


- Show [token required]

	/api/users/id:
		get:
			description: show a user



- Create N[token required]

	/api/users:
		post:
			description: create a user.
       

#### Orders
- Current Order by user (args: user id)[token required]

	/api/orders/user/:user_id/:status:
		
		get:
			description: show all orders for a user by status

		
	Eg.
		/api/orders/user/:user_id/active:
		/api/orders/user/:user_id/complete:
			


- [OPTIONAL] Completed Orders by user (args: user id)[token required]

See above (/api/orders/user/:user_id/complete)



## Data Shapes
#### Product
-  id
- name
- price
- [OPTIONAL] category

#### User
- id
- firstName
- lastName
- password

#### Orders
- id
- id of each product in the order
- quantity of each product in the order
- user_id
- status of order (active or complete)





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
        