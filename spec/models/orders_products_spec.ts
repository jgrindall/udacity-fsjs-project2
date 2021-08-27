import {Order, OrderStatus, OrderStore} from "../../src/models/order";
import {Users, UsersStore} from "../../src/models/users";
import {Product, ProductStore} from "../../src/models/product";
import {testingUser} from "../api/helpers";

describe("Test products in orders", ()=>{

    afterAll(async()=>{
        await userStore.deleteAll();
        return await productStore.deleteAll();
    });

    beforeAll(async()=>{
        await userStore.deleteAll();
        return await productStore.deleteAll();
    });

    let userIdCreated:number;
    let orderIdsCreated: number[] = [];
    let productIdsCreated:number[];

    const orderStore = new OrderStore();
    const userStore = new UsersStore();
    const productStore = new ProductStore();

    it("make a new user", async()=>{
        const user:Users = await userStore.create(testingUser);
        userIdCreated = user.id;
        const orders:Order[] = await orderStore.getAllOrdersForUser(userIdCreated);

        expect(orders).toEqual([]);
    });

    it("make some products", async()=>{
        await productStore.deleteAll();
        const p1:Product = await productStore.create({name:"product1", price:10, category:"home"});
        const p2:Product = await productStore.create({name:"product2", price:11, category:"home"});
        const p3:Product = await productStore.create({name:"product3", price:12, category:"office"});
        productIdsCreated = [
            p1.id,
            p2.id,
            p3.id
        ];
    });

    it("make a new order and test getForUser", async()=>{
        const order = await orderStore.create({
            status:OrderStatus.ACTIVE,
            user_id:userIdCreated
        });
        orderIdsCreated[0] = order.id;
        const orders:Order[] = await orderStore.getAllOrdersForUser(userIdCreated);

        expect(orders.length).toEqual(1);
        expect(orders[0].user_id).toEqual(userIdCreated);
        expect(orders[0].status).toEqual(OrderStatus.ACTIVE);

        const products:Product[] = await orderStore.getProductsForOrder(order.id);

        expect(products.length).toEqual(0);
        await orderStore.addProductToOrder(orderIdsCreated[0], productIdsCreated[0], 1);

        const products0:Product[] = await orderStore.getProductsForOrder(orderIdsCreated[0]);

        expect(products0.length).toEqual(1);
    });

    it("close order", async()=>{
        const order = await orderStore.completeOrder(orderIdsCreated[0]);

        expect(order).toBeTruthy();
        expect(order.status).toEqual(OrderStatus.COMPLETE);
        expect(order.id).toEqual(orderIdsCreated[0]);
    });

    it("make a new order and add products to it", async()=>{
        const order = await orderStore.create({
            status:OrderStatus.ACTIVE,
            user_id:userIdCreated
        });
        orderIdsCreated[1] = order.id;

        await orderStore.addProductToOrder(orderIdsCreated[1], productIdsCreated[0], 1);
        await orderStore.addProductToOrder(orderIdsCreated[1], productIdsCreated[1], 2);
        await orderStore.addProductToOrder(orderIdsCreated[1], productIdsCreated[2], 3);

        const orders:Order[] = await orderStore.getAllOrdersForUser(userIdCreated);

        expect(orders.length).toEqual(2);

        expect(orders[0].id).toEqual(orderIdsCreated[0]);
        expect(orders[1].id).toEqual(orderIdsCreated[1]);

        const products0:Product[] = await orderStore.getProductsForOrder(orderIdsCreated[0]);

        expect(products0.length).toEqual(1);

        const products1:Product[] = await orderStore.getProductsForOrder(orderIdsCreated[1]);

        expect(products1.length).toEqual(3);
    });

    it("delete an order and associated data", async()=>{
        const products:Product[] = await orderStore.getProductsForOrder(orderIdsCreated[0]);

        expect(products.length).toEqual(1);
        await orderStore.deleteOrder(orderIdsCreated[0]);
        const products2:Product[] = await orderStore.getProductsForOrder(orderIdsCreated[0]);

        expect(products2.length).toEqual(0);
        const orders2:Order[] = await orderStore.getAllOrdersForUser(userIdCreated);

        expect(orders2.length).toEqual(1);
    });

    it("delete a user and associated data", async()=>{
        await userStore.delete(userIdCreated);
        const orders:Order[] = await orderStore.getAllOrdersForUser(userIdCreated);

        expect(orders.length).toEqual(0);

        const products0:Product[] = await orderStore.getProductsForOrder(orderIdsCreated[0]);

        expect(products0.length).toEqual(0);

        const products1:Product[] = await orderStore.getProductsForOrder(orderIdsCreated[1]);

        expect(products1.length).toEqual(0);

        const products = await productStore.index();

        expect(products.length).toEqual(3);

    });

});


