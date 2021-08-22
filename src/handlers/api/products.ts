import express from "express";
import {ProductStore, Product} from "../../models/product";

const store = new ProductStore();

export default express
    .Router()
    .get("/", async (req: express.Request, res: express.Response) => {
        const orders = await store.index();
        res.json(orders);
    })
    .get("/:id", async (req: express.Request, res: express.Response) => {
        const id = parseInt(req.params.id);
        const product:Product = await store.find(id);
        res.json(product);
    })
    .get("/category/:category", async (req: express.Request, res: express.Response) => {
        const category = req.params.category;
        const products:Product[] = await store.findByCategory(category);
        res.json(products);
    })
    .post("/", async (req: express.Request, res: express.Response) => {
        const body:Omit<Product, "id"> = req.body as Omit<Product, "id">;
        const product:Product = await store.create(body);
        res.json(product);
    })
