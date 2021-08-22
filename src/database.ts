import dotenv from 'dotenv'
import {Pool} from 'pg'
import path from 'path';

const configPath = path.resolve(__dirname, '../.env');

dotenv.config({
    path:configPath
});

const {
    POSTGRES_HOST,
    POSTGRES_DB,
    POSTGRES_USER,
    POSTGRES_PASSWORD,
    ENV,
    POSTGRES_DB_TEST
} = process.env;

let config;

if(ENV === "test"){
    config = {
        host: POSTGRES_HOST,
        database: POSTGRES_DB_TEST,
        user:POSTGRES_USER,
        password:POSTGRES_PASSWORD
    }
}
else{
    config = {
        host: POSTGRES_HOST,
        database: POSTGRES_DB,
        user:POSTGRES_USER,
        password:POSTGRES_PASSWORD
    };
}

const client:Pool = new Pool(config);

export default client;