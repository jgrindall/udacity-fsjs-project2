import client from "../database";
import bcrypt from "bcrypt";

export type Users = {
    id: number;
    firstName: string;
    lastName:string;
    password: string;
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
            const sql = 'delete from users where id = $1 returning *';
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

    async create(user: Omit<Users, "id">): Promise<Users> {
        try {
            const hash = bcrypt.hashSync(
                user.password + BCRYPT_PASSWORD,
                parseInt(SALT_ROUNDS)
            );
            const sql = 'insert into users ("firstName", "lastName", password) values($1, $2, $3) returning *';
            const connection = await client.connect();
            const result = await connection.query(sql, [user.firstName, user.lastName, hash]);
            await connection.release();
            return result.rows[0];
        }
        catch (err) {
            throw new Error(`Could not add new user. Error: ${err}`)
        }
    }

    async authenticate(username:string, password:string): Promise<Users | null> {
        const names = username.split(" ");
        const sql = 'select * from users where "firstName" = $1 and "lastName" = $2';
        const connection = await client.connect();
        const result = await connection.query(sql, names);
        await connection.release();
        if(result.rows.length === 1){
            const user:Users = result.rows[0];
            if(bcrypt.compareSync(password + BCRYPT_PASSWORD, user.password)){
                return user;
            }
        }
        return null;
    }

}

