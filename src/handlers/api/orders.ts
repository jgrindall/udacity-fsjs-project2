import express from "express";
import {OrderStore, Order, OrderStatus} from "../../models/order";
import verifyAuth from "../middleware/auth";
import {CountedProduct} from "../../models/product";

const store = new OrderStore();

export default express
    .Router()

    //list all orders
    .get("/", [verifyAuth], async (req: express.Request, res: express.Response) => {
        const orders = await store.index();
        res
            .status(200)
            .json(orders);
    })

    //get order by id
    .get("/:id", [verifyAuth], async (req: express.Request, res: express.Response) => {
        const id = parseInt(req.params.id);
        const order = await store.find(id);
        res
            .status(200)
            .json(order);
    })

    //get orders by user
    .get("/user/:user_id", [verifyAuth], async (req: express.Request, res: express.Response) => {
        const user_id = parseInt(req.params.user_id);
        const order = await store.getAllOrdersForUser(user_id);
        res
            .status(200)
            .json(order);
    })

    //get orders by user and status
    .get("/user/:user_id/:status", [verifyAuth], async (req: express.Request, res: express.Response) => {
        const user_id = parseInt(req.params.user_id);
        const status:OrderStatus = req.params.status as OrderStatus;
        const order = await store.getAllOrdersForUserAndStatus(user_id, status);
        res
            .status(200)
            .json(order);
    })

    // create a new order
    .post("/", [verifyAuth], async (req: express.Request, res: express.Response) => {
        const body: Omit<Order, "id"> = req.body as Omit<Order, "id">;
        try {
            const user = await store.create(body);
            res
                .status(200)
                .json(user);
        }
        catch (e) {
            res
                .status(403)
                .json(null);
        }
    })

    // get products in an order
    .get("/:order_id/products", [verifyAuth], async (req: express.Request, res: express.Response) => {
        const order_id = parseInt(req.params.order_id);
        const products:CountedProduct[] = await store.getProductsForOrder(order_id);
        res
            .status(200)
            .json(products);
    })

    //add product to order, given quantity and product id
    .post("/:order_id/products", [verifyAuth], async (req: express.Request, res: express.Response) => {
        const order_id = parseInt(req.params.order_id);
        const body = req.body as {quantity: number; product_id: number};
        try {
            const product:{id:number} = await store.addProductToOrder(order_id, body.product_id, body.quantity);
            res
                .status(200)
                .json(product);
        }
        catch (e) {
            res
                .status(403)
                .json(null);
        }
    });
