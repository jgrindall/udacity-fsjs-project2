import client from "../database";
import bcrypt from "bcrypt";

export type Users = {
    id: number;
    username: string;
    password_digest: string;
}

const BCRYPT_PASSWORD:string = process.env.BCRYPT_PASSWORD as string;
const SALT_ROUNDS:string = process.env.SALT_ROUNDS as string;

export class UsersStore{
    constructor() {

    }
    async index(): Promise<Users[]> {
        try {
            const connection = await client.connect();
            const sql = 'select * from users';
            const result = await connection.query(sql);
            connection.release();
            return result.rows;
        }
        catch (err) {
            throw new Error(`Could not get users. Error: ${err}`)
        }
    }

    async find(id:number):Promise<Users>{
        try{
            const connection = await client.connect();
            const sql = 'select * from users where id=$1';
            const result = await connection.query(sql, [id]);
            await connection.release();
            return result.rows[0];
        }
        catch(e){
            throw new Error("get user error " + e.message);
        }
    }

    async delete(id:number):Promise<Users>{
        try{
            const connection = await client.connect();
            const sql = 'delete from users where id=$1 returning *';
            const result = await connection.query(sql, [id]);
            await connection.release();
            return result.rows[0];
        }
        catch(e){
            throw new Error("del user error " + e.message);
        }
    }

    async deleteAll():Promise<Users[]>{
        try{
            const connection = await client.connect();
            const sql = 'delete from users returning *';
            const result = await connection.query(sql);
            await connection.release();
            return result.rows;
        }
        catch(e){
            throw new Error("del users error " + e.message);
        }
    }

    async create(username:string, password:string): Promise<Users> {
        try {
            const hash = bcrypt.hashSync(
                password + BCRYPT_PASSWORD,
                parseInt(SALT_ROUNDS as string)
            );
            const sql = 'insert into users (username, password_digest) values($1, $2) returning *';
            const connection = await client.connect();
            const result = await connection.query(sql, [username, hash]);
            await connection.release();
            const user = result.rows[0];
            return user;
        }
        catch (err) {
            throw new Error(`Could not add new user. Error: ${err}`)
        }
    }

    async getWithOrders():Promise<{id:number}[]>{
        try {
            const sql = 'select u.id from users u inner join orders o on u.id = o.user_id';
            const connection = await client.connect();
            const result = await connection.query(sql);
            await connection.release();
            return result.rows;
        }
        catch (err) {
            throw new Error(`Could not get with orders Error: ${err}`)
        }
    }

    async authenticate(username:string, password:string): Promise<Users | null> {
        const sql = 'select * from users where username=$1';
        const connection = await client.connect();
        const result = await connection.query(sql, [username]);
        await connection.release();
        if(result.rows.length === 1){
            const user:Users = result.rows[0];
            if(bcrypt.compareSync(password + BCRYPT_PASSWORD, user.password_digest)){
                return user;
            }
        }
        return null;
    }

}

