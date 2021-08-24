import supertest from "supertest";
import app from "../../src/server";
import {Order} from "../../src/models/order";
import {Users, UsersStore} from "../../src/models/users";
import {ProductStore} from "../../src/models/product";
import {token} from "./helpers";

const request = supertest(app);
const userStore = new UsersStore();
const productStore = new ProductStore();

let userIdCreated: number;
let orderIdCreated: number;

describe("Test endpoint success", async () => {

    afterAll(async()=>{
        await userStore.deleteAll();
        return await productStore.deleteAll();
    });

    beforeAll(async()=>{
        await userStore.deleteAll();
        return await productStore.deleteAll();
    });

    it("test list", async () => {
        const response = await request.get("/api/orders");
        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    });

    it("test create", async () => {
        // first create a user
        const user:Omit<Users, "id"> = {
            firstName:"paul",
            lastName:"smith",
            password:"s0meth1ng"
        };
        const response = await request
            .post("/api/users")
            .set('Authorization', 'Bearer ' + token)
            .send(user);

        const user2:Users = (response.body as Users);

        expect(response.status).toBe(200);
        expect(user2).toBeTruthy();

        userIdCreated = user2.id;

        const order:Omit<Order, "id"> = {
            status:"active",
            user_id:userIdCreated
        };
        const response2 = await request
            .post("/api/orders")
            .send(order);
        expect(response2.status).toBe(200);
        const order2:Order = (response2.body as Order);
        expect(order2).toBeTruthy();
        expect(order2.user_id).toEqual(userIdCreated);

        orderIdCreated = order2.id;

        const response3 = await request.get("/api/orders");
        expect(response3.status).toBe(200);
        const orders = (response3.body as Order[]);
        expect(orders).toBeTruthy();
        expect(orders.length).toEqual(1);
        expect(orders[0].status).toEqual("active");
        expect(orders[0].user_id).toEqual(userIdCreated);

    });

    it("test get by id", async () => {
        const response = await request.get("/api/orders/" + orderIdCreated);
        expect(response.status).toBe(200);
        const order:Order = (response.body) as Order;
        expect(order.id).toEqual(orderIdCreated);
        expect(order.user_id).toEqual(userIdCreated);

    });

    it("test get by user_id", async () => {
        const response = await request.get("/api/orders/user/" + userIdCreated);
        expect(response.status).toBe(200);
        const orders:Order[] = (response.body) as Order[];

        expect(orders.length).toEqual(1);
        expect(orders[0].id).toEqual(orderIdCreated);
        expect(orders[0].user_id).toEqual(userIdCreated);
    });

    it("test cascade when user deleted", async () => {
        const user = await userStore.delete(userIdCreated);
        const response = await request.get("/api/orders");
        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);

        const response2 = await request.get("/api/orders/user/" + userIdCreated);
        expect(response2.status).toBe(200);
        const orders:Order[] = (response2.body) as Order[];
        expect(orders).toEqual([]);
    });

});
