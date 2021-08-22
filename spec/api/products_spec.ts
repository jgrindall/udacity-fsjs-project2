import supertest from "supertest";
import app from "../../src/server";
import {Product, ProductStore} from "../../src/models/product";
import {UsersStore} from "../../src/models/users";
const request = supertest(app);

describe("Test endpoint success", async () => {

    const userStore = new UsersStore();
    const productStore = new ProductStore();

    afterAll(async()=>{
        await userStore.deleteAll();
        return await productStore.deleteAll();
    });

    beforeAll(async()=>{
        await userStore.deleteAll();
        return await productStore.deleteAll();
    });

    it("test list", async () => {
        const response = await request.get("/api/products");
        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    });

    let idCreated: number;

    it("test create", async () => {

        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJ1c2VybmFtZSI6ImpncmluZGFsbCIsInBhc3N3b3JkX2RpZ2VzdCI6IiQyYiQxMCRQVXhzTXJXRi43WGxWUzcvVlZveHoudTVUbGpNVUhXb05jQmNsUmhWa2QvQXR2UkdNQXEvbSJ9LCJpYXQiOjE2MjkwNDI5OTl9.GRcodSDEG9hIXLjt3ssa6AE4oEZ56Uyyqz6PQi8nJUw";

        TODO
        
        const response = await request
            .post("/api/products")
            .set('Authorization', 'Bearer ' + token)
            .send({
                category:"home",
                name:"name1",
                price:10
            });



        expect(response.status).toBe(200);
        const product2:Product = (response.body as Product);
        expect(product2).toBeTruthy();
        expect(product2.name).toEqual("name1");

        idCreated = product2.id;

        const response2 = await request.get("/api/products");
        expect(response2.status).toBe(200);
        const products = (response2.body as Product[]);
        expect(products).toBeTruthy();
        expect(products.length).toEqual(1);
        expect(products[0].name).toEqual("name1");
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
