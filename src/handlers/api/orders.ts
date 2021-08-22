import express from "express";
import {OrderStore, Order} from "../../models/order";

const store = new OrderStore();

export default express
    .Router()
    .get("/", async (req: express.Request, res: express.Response) => {
        const orders = await store.index();
        res.json(orders);
    })
    .get("/:id", async (req: express.Request, res: express.Response) => {
        const id = parseInt(req.params.id);
        const order = await store.find(id);
        res.json(order);
    })
    .get("/user/:user_id", async (req: express.Request, res: express.Response) => {
        const user_id = parseInt(req.params.user_id);
        const order = await store.getForUser(user_id);
        res.json(order);
    })
    .post("/", async (req: express.Request, res: express.Response) => {
        const body:Omit<Order, "id"> = req.body as Omit<Order, "id">;
        const user = await store.create(body);
        res.json(user);
    });
