import supertest from "supertest";
import app from "../../src/server";
import {Product} from "../../src/models/product";
const request = supertest(app);

describe("Test endpoint success", async () => {

    it("test list", async () => {
        const response = await request.get("/api/products");
        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    });

    let idCreated: number;

    it("test create", async () => {
        const product:Omit<Product, "id"> = {
            category:"home",
            name:"name1",
            price:10
        };
        const response = await request
            .post("/api/products")
            .send(product);
        expect(response.status).toBe(200);
        const product2:Product = (response.body as Product);
        expect(product2).toBeTruthy();
        expect(product2.name).toEqual(product.name);

        idCreated = product2.id;

        const response2 = await request.get("/api/products");
        expect(response2.status).toBe(200);
        const products = (response2.body as Product[]);
        expect(products).toBeTruthy();
        expect(products.length).toEqual(1);
        expect(products[0].name).toEqual(product.name);
    });

    it("test get by id", async () => {
        const response = await request.get("/api/products/" + idCreated);
        expect(response.status).toBe(200);
        expect(response.body.name).toEqual("name1");
    });

    it("test get by category", async()=>{
        const response = await request.get("/api/products/category/home");
        expect(response.status).toBe(200);
        const products = (response.body as Product[]);
        expect(products.length).toEqual(1);
        expect(products[0].category).toEqual("home");

        const response2 = await request.get("/api/products/category/office");
        expect(response2.status).toBe(200);
        const products2 = (response2.body as Product[]);
        expect(products2).toEqual([]);
    });


});
