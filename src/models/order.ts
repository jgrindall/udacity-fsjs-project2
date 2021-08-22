import client from "../database";

export type Order = {
    id: number;
    status: "active" | "complete";
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

    async getForUser(user_id:number):Promise<Order[]>{
        try{
            const connection = await client.connect();
            const sql = 'select * from orders where user_id=$1';
            const result = await connection.query(sql, [user_id]);
            await connection.release();
            return result.rows;
        }
        catch(e){
            throw new Error("get orders for user error " + e.message);
        }
    }

    async create(order: Omit<Order, "id">): Promise<Order> {
        try {
            const sql = 'insert into orders (status, user_id) values($1, $2) returning *';
            const connection = await client.connect();
            const result = await connection.query(sql, [order.status, order.user_id]);
            await connection.release();
            return result.rows[0];
        }
        catch (err) {
            throw new Error(`Could not add new orders. Error: ${err}`)
        }
    }

}