import express from "express";
import {UsersStore} from "../../models/users";
import jwt from "jsonwebtoken";

const JWT_TOKEN_SECRET:string = process.env.JWT_TOKEN_SECRET as string;

const store = new UsersStore();

export default express
    .Router()
    .get("/", async (req: express.Request, res: express.Response) => {
        const users = await store.index();
        res.json(users);
    })
    .get("/withOrders", async (req: express.Request, res: express.Response) => {
        const ids: {id:number}[] = await store.getWithOrders();
        res.json(ids);
    })
    .get("/:id", async (req: express.Request, res: express.Response) => {
        const id = parseInt(req.params.id);
        const user = await store.find(id);
        res.json(user);
    })
    .delete("/:id", async (req: express.Request, res: express.Response) => {
        const id = parseInt(req.params.id);
        const user = await store.delete(id);
        res.json(user);
    })
    .post("/", async (req: express.Request, res: express.Response) => {
        const body = req.body as {username:string, password:string};
        const user = await store.create(body.username, body.password);
        res.json(user);
    })
    .post("/auth", async (req: express.Request, res: express.Response) => {
        const body = req.body as {username:string, password:string};
        const user = await store.authenticate(body.username, body.password);
        if(user){
            const token = jwt.sign({user:user}, JWT_TOKEN_SECRET);
            //console.log(token);
            res
                .status(200)
                .header("")
                .json(user);
        }
        else{
            res
                .status(401)
                .json(null);
        }
    });

