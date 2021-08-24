import {OrderStore, Order, OrderStatus} from "../../src/models/order";
import {Users, UsersStore} from "../../src/models/users";
import {ProductStore} from "../../src/models/product";

describe("Test orders store", ()=>{

    const orderStore = new OrderStore();
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

    let userIdCreated:number;
    let orderIdCreated: number;

    xit("list orders", async()=>{
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
            status:OrderStatus.ACTIVE,
            user_id:userIdCreated
        };
        const order2 = await orderStore.create(order);
        expect(order2).toBeTruthy();
        expect(order2.user_id).toEqual(userIdCreated);
        orderIdCreated = order2.id;

        const orders:Order[] = await orderStore.index();
        expect(orders.length).toEqual(1);

    });

    xit("test get by id", async () => {
        const order:Order = await orderStore.find(orderIdCreated);
        expect(order.id).toEqual(orderIdCreated);
        expect(order.user_id).toEqual(userIdCreated);
    });

    xit("test get by user_id", async () => {
        const orders:Order[] = await orderStore.getAllOrdersForUser(userIdCreated);
        expect(orders.length).toEqual(1);
        expect(orders[0].id).toEqual(orderIdCreated);
        expect(orders[0].user_id).toEqual(userIdCreated);
    });

    xit("test cascade when user deleted", async () => {
        const user = await userStore.delete(userIdCreated);

        const orders:Order[] = await orderStore.index();
        expect(orders).toBeTruthy();
        expect(orders).toEqual([]);

        const orders2:Order[] = await orderStore.getAllOrdersForUser(userIdCreated);
        expect(orders2.length).toEqual(0);
    });


});
