import express from "express";
import {OrderStore} from "../../models/order";

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
    .post("/", async (req: express.Request, res: express.Response) => {
        const body = req.body as {status:string, user_id:number};
        const user = await store.create(body.status, body.user_id);
        res.json(user);
    })
    .get("/:order_id/products", async (req: express.Request, res: express.Response) => {
        const order_id = parseInt(req.params.order_id);
        const user = await store.getProductsForOrder(order_id);
        res.json(user);
    })
    .post("/:order_id/products", async (req: express.Request, res: express.Response) => {
        const order_id = parseInt(req.params.order_id);
        const body = req.body as {quantity:number, product_id:number};
        const user = await store.addProductToOrder(body.quantity, order_id, body.product_id);
        res.json(user);
    })


