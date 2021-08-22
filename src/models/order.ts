import client from "../database";
import {Product} from "./product";

export type Order = {
    id: number;
    status: string;
    user_id: number;
}

export class OrderStore{
    constructor() {

    }
    async index(): Promise<Order[]> {
        try {
            const connection = await client.connect();
            const sql = 'select * from orders';
            const result = await connection.query(sql);
            connection.release();
            return result.rows;
        }
        catch (err) {
            throw new Error(`Could not get orders. Error: ${err}`)
        }
    }

    async find(id:number):Promise<Order>{
        try{
            const connection = await client.connect();
            const sql = 'select * from orders where id=$1';
            const result = await connection.query(sql, [id]);
            await connection.release();
            return result.rows[0];
        }
        catch(e){
            throw new Error("get order error " + e.message);
        }
    }

    async create(status:string, user_id:number): Promise<Order> {
        try {
            const sql = 'insert into orders (status, user_id) values($1, $2) returning *';
            const connection = await client.connect();
            const result = await connection.query(sql, [status, user_id]);
            await connection.release();
            return result.rows[0];
        }
        catch (err) {
            throw new Error(`Could not add new orders. Error: ${err}`)
        }
    }

    async deleteOrder(order_id: number):Promise<Order>{
        try {
            const connection = await client.connect();
            const sql = 'delete from orders where id = $1';
            const result = await connection.query(sql, [order_id]);
            connection.release();
            return result.rows[0];
        }
        catch (err) {
            throw new Error(`Could not delete order. Error: ${err}`)
        }
    }

    async getOrdersForUser(user_id:number):Promise<Order[]>{
        try {
            const sql = 'select * from orders where user_id = $1';
            const connection = await client.connect();
            const result = await connection.query(sql, [user_id]);
            await connection.release();
            return result.rows;
        }
        catch (err) {
            throw new Error(`Could not get orders. Error: ${err}`)
        }
    }

    async addProductToOrder(quantity:number, order_id:number, product_id:number): Promise<{id:number}>{
        try {
            const sql = 'insert into order_products (quantity, order_id, product_id) values($1, $2, $3) returning id';
            const connection = await client.connect();
            const result = await connection.query(sql, [quantity, order_id, product_id]);
            await connection.release();
            return result.rows[0];
        }
        catch (err) {
            throw new Error(`Could not add new product to order. Error: ${err}`)
        }
    }

    async getProductsForOrder(order_id:number): Promise<Product[]>{
        try {
            const sql = 'select p.id, p.name, p.price from order_products op join products p on p.id = op.product_id where order_id = $1';
            const connection = await client.connect();
            const result = await connection.query(sql, [order_id]);
            await connection.release();
            return result.rows;
        }
        catch (err) {
            throw new Error(`Could not get products for order. Error: ${err}`)
        }
    }

}