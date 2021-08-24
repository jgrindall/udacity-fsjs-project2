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
        const order = await store.getAllOrdersForUser(user_id);
        res.json(order);
    })
    .post("/", async (req: express.Request, res: express.Response) => {
        const body:Omit<Order, "id"> = req.body as Omit<Order, "id">;
        const user = await store.create(body);
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
