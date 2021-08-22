import {OrderStore, Order} from "../../src/models/order";
import {Users, UsersStore} from "../../src/models/users";

const orderStore = new OrderStore();
const userStore = new UsersStore();

describe("Test orders store", ()=>{

    afterAll(async()=>{
        return await userStore.deleteAll();
    });

    beforeAll(async()=>{
        return await userStore.deleteAll();
    });

    let userIdCreated:number;
    let orderIdCreated: number;

    it("list orders", async()=>{
        const orders:Order[] = await orderStore.index();
        expect(orders).toBeTruthy();
        expect(orders).toEqual([]);
    });

    it("create an order", async ()=>{
        const user:Users = await userStore.create({
            firstName:"paul",
            lastName:"smith",
            password:"passw0rd"
        });
        userIdCreated = user.id;
        const order:Omit<Order, "id"> = {
            status:"active",
            user_id:userIdCreated
        };
        const order2 = await orderStore.create(order);
        expect(order2).toBeTruthy();
        expect(order2.user_id).toEqual(userIdCreated);
        orderIdCreated = order2.id;

        const orders:Order[] = await orderStore.index();
        expect(orders.length).toEqual(1);

    });

    it("test get by id", async () => {
        const order:Order = await orderStore.find(orderIdCreated);
        expect(order.id).toEqual(orderIdCreated);
        expect(order.user_id).toEqual(userIdCreated);
    });

    it("test get by user_id", async () => {
        const orders:Order[] = await orderStore.getForUser(userIdCreated);
        expect(orders.length).toEqual(1);
        expect(orders[0].id).toEqual(orderIdCreated);
        expect(orders[0].user_id).toEqual(userIdCreated);
    });

    it("test cascade when user deleted", async () => {
        const user = await userStore.delete(userIdCreated);

        const orders:Order[] = await orderStore.index();
        expect(orders).toBeTruthy();
        expect(orders).toEqual([]);

        const orders2:Order[] = await orderStore.getForUser(userIdCreated);
        expect(orders2.length).toEqual(0);
    });


});
