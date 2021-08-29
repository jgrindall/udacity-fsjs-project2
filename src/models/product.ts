import client from "../database";

export type Product = {
    id: number;
    name: string;
    price: number;
    category: string;
};

export type CountedProduct  = Product & { quantity: number };

const validate = (product:Omit<Product, "id">)=>{
    if(product.name && product.price && product.category){
        // ok
    }
    else{
        throw new Error("invalid product");
    }
};

export class ProductStore {
    constructor() {}

    async deleteAll(): Promise<Product[]> {
        try {
            const connection = await client.connect();
            const sql = "delete from products returning *";
            const result = await connection.query(sql);
            connection.release();
            return result.rows;
        } catch (err) {
            throw new Error(`Could not del all products. Error: ${err}`);
        }
    }

    async index(): Promise<Product[]> {
        try {
            const connection = await client.connect();
            const sql = "select * from products";
            const result = await connection.query(sql);
            connection.release();
            return result.rows;
        } catch (err) {
            throw new Error(`Could not get products. Error: ${err}`);
        }
    }

    async find(id: number): Promise<Product> {
        try {
            const connection = await client.connect();
            const sql = "select * from products where id=$1";
            const result = await connection.query(sql, [id]);
            await connection.release();
            return result.rows[0];
        } catch (e) {
            throw new Error("get products error " + e.message);
        }
    }

    async findByCategory(category: string): Promise<Product[]> {
        try {
            const connection = await client.connect();
            const sql = "select * from products where category=$1";
            const result = await connection.query(sql, [category]);
            await connection.release();
            return result.rows;
        } catch (e) {
            throw new Error("get products by category error " + e.message);
        }
    }

    async create(product: Omit<Product, "id">): Promise<Product> {
        try {
            validate(product);
            const sql = "insert into products (name, price, category) values($1, $2, $3) returning *";
            const connection = await client.connect();
            const result = await connection.query(sql, [product.name, product.price, product.category]);
            await connection.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Could not add new product. Error: ${err}`);
        }
    }
}
