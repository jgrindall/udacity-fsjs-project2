import express from "express";
import {UsersStore, Users} from "../../models/users";
import jwt from "jsonwebtoken";
import verifyAuth from "../middleware/auth";

const JWT_TOKEN_SECRET:string = process.env.JWT_TOKEN_SECRET as string;

const store = new UsersStore();

export default express
    .Router()
    .get("/", [verifyAuth], async (req: express.Request, res: express.Response) => {
        const users = await store.index();
        res.json(users);
    })
    .get("/:id", [verifyAuth], async (req: express.Request, res: express.Response) => {
        const id = parseInt(req.params.id);
        const user = await store.find(id);
        res.json(user);
    })
    .delete("/:id", [verifyAuth], async (req: express.Request, res: express.Response) => {
        const id = parseInt(req.params.id);
        const user = await store.delete(id);
        res.json(user);
    })
    .post("/", [verifyAuth], async (req: express.Request, res: express.Response) => {
        const body:Omit<Users, "id"> = req.body as Omit<Users, "id">;
        const user = await store.create(body);
        res.json(user);
    })
    .post("/auth", async (req: express.Request, res: express.Response) => {
        const body = req.body as {username:string, password:string};
        const user = await store.authenticate(body.username, body.password);
        if(user){
            const token = jwt.sign({user:user}, JWT_TOKEN_SECRET);
            console.log(token);
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

