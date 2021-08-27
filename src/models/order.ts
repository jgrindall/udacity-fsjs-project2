import client from "../database";
import {Product} from "./product";

/** orders can be in two states - active or complete **/

export enum OrderStatus {
    ACTIVE = "active",
    COMPLETE = "complete"
}

export type Order = {
    id: number;
    status: OrderStatus;
    user_id: number;
};

const validate = (order:Omit<Order, "id">)=>{
    if(order.status && order.user_id){
        // ok
    }
    else{
        throw new Error("invalid order");
    }
};

export class OrderStore {
    constructor() {}
    async index(): Promise<Order[]> {
        try {
            const connection = await client.connect();
            const sql = "select * from orders";
            const result = await connection.query(sql);
            connection.release();
            return result.rows;
        } catch (err) {
            throw new Error(`Could not get orders. Error: ${err}`);
        }
    }

    async find(id: number): Promise<Order> {
        try {
            const connection = await client.connect();
            const sql = "select * from orders where id=$1";
            const result = await connection.query(sql, [id]);
            await connection.release();
            return result.rows[0];
        } catch (e) {
            throw new Error("get order error " + e.message);
        }
    }

    async completeOrder(id: number): Promise<Order> {
        try {
            const connection = await client.connect();
            const sql = "update orders set status=$1 where id=$2 returning *";
            const result = await connection.query(sql, [OrderStatus.COMPLETE, id]);
            await connection.release();
            return result.rows[0];
        } catch (e) {
            throw new Error("get order error " + e.message);
        }
    }

    async getAllOrdersForUserAndStatus(user_id: number, status:OrderStatus):Promise<Order[]> {
        try {
            const connection = await client.connect();
            const sql = "select * from orders where user_id=$1 and status=$2";
            const result = await connection.query(sql, [user_id, status]);
            await connection.release();
            return result.rows;
        } catch (e) {
            throw new Error("get order for user error " + e.message);
        }
    }

    async getAllOrdersForUser(user_id: number): Promise<Order[]> {
        try {
            const connection = await client.connect();
            const sql = "select * from orders where user_id=$1";
            const result = await connection.query(sql, [user_id]);
            await connection.release();
            return result.rows;
        } catch (e) {
            throw new Error("get orders for user error " + e.message);
        }
    }

    /** a user is allowed one active order **/
    async getCurrentOrderForUser(user_id: number): Promise<Order> {
        let result;
        try {
            const connection = await client.connect();
            const sql = "select * from orders where user_id=$1 and status=$2";
            result = await connection.query(sql, [user_id, OrderStatus.ACTIVE]);
            await connection.release();
        } catch (e) {
            throw new Error("get orders for user error " + e.message);
        }
        if(result.rows.length >= 2) {
            throw new Error(`Multiple orders found for user ${user_id}`);
        }
        return result.rows[0];
    }

    /** create a new order. A user is allowed one active order **/
    async create(order: Omit<Order, "id">): Promise<Order> {
        validate(order);
        const currentOrder = await this.getCurrentOrderForUser(order.user_id);
        if(order.status === OrderStatus.ACTIVE && currentOrder) {
            throw new Error("current order already exists");
        } else{
            try {
                const sql = "insert into orders (status, user_id) values($1, $2) returning *";
                const connection = await client.connect();
                const result = await connection.query(sql, [order.status, order.user_id]);
                await connection.release();
                return result.rows[0];
            } catch (err) {
                throw new Error(`Could not add new orders. Error: ${err}`);
            }
        }
    }

    async deleteOrder(order_id: number): Promise<Order> {
        try {
            const connection = await client.connect();
            const sql = "delete from orders where id = $1";
            const result = await connection.query(sql, [order_id]);
            connection.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Could not delete order. Error: ${err}`);
        }
    }

    async addProductToOrder(order_id: number, product_id: number, quantity: number): Promise<{id: number}> {
        try {
            const sql = "insert into order_products (quantity, order_id, product_id) values($1, $2, $3) returning id";
            const connection = await client.connect();
            const result = await connection.query(sql, [quantity, order_id, product_id]);
            await connection.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Could not add new product to order. Error: ${err}`);
        }
    }

    async getProductsForOrder(order_id: number): Promise<Product[]> {
        try {
            const sql =
                "select p.id, p.name, p.price from order_products op join products p on op.product_id = p.id where order_id = $1";
            const connection = await client.connect();
            const result = await connection.query(sql, [order_id]);
            await connection.release();
            return result.rows;
        } catch (err) {
            throw new Error(`Could not get products for order. Error: ${err}`);
        }
    }
}
