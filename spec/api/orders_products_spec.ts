import supertest from "supertest";
import app from "../../src/server";
import {Order, OrderStatus} from "../../src/models/order";
import {Users, UsersStore} from "../../src/models/users";
import {Product, ProductStore} from "../../src/models/product";
import {testingUser, token} from "./helpers";
const request = supertest(app);

let userIdCreated:number;
let orderIdCreated: number;
let productIdsCreated:number[];

const userStore = new UsersStore();
const productStore = new ProductStore();

describe("api", async () => {

    afterAll(async()=>{
        await userStore.deleteAll();
        return await productStore.deleteAll();
    });

    beforeAll(async()=>{
        await userStore.deleteAll();
        return await productStore.deleteAll();
    });

    it("test creating a user and products", async () => {
        // first create a user and an order, and some products
        const response = await request
            .post("/api/users")
            .set('Authorization', 'Bearer ' + token)
            .send(testingUser);

        const user:Users = (response.body as Users);
        userIdCreated = user.id;

        const response2 = await request.get("/api/orders/user/" + userIdCreated);
        const orders:Order[] = (response2.body as Order[]);

        expect(orders.length).toEqual(0);

        const response0 = await request
            .post("/api/products")
            .set('Authorization', 'Bearer ' + token)
            .send({
                category:"home",
                name:"name1",
                price:10
            });
        const p0:Product = (response0.body as Product);
        productIdsCreated = [p0.id];
    });

    it("test create an order and add products", async () => {

        const response3 = await request
            .post("/api/orders")
            .send({
                status: OrderStatus.ACTIVE,
                user_id:userIdCreated
            });

        const order:Order = (response3.body as Order);
        orderIdCreated = order.id;

        const response4 = await request.get("/api/orders/user/" + userIdCreated);
        const orders2:Order[] = (response4.body as Order[]);

        expect(orders2.length).toEqual(1);

        const response5 = await request
            .get("/api/orders/" + orderIdCreated + "/products");

        const products:Product[] = (response5.body as Product[]);

        expect(products.length).toEqual(0);

        await request
            .post("/api/orders/" + orderIdCreated + "/products")
            .send({
                quantity:1,
                product_id:productIdsCreated[0]
            });

        const response7 = await request
            .get("/api/orders/" + orderIdCreated + "/products");

        const products2:Product[] = (response7.body as Product[]);

        expect(products2.length).toEqual(1);

    });

});
