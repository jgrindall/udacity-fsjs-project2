import {OrderStore, Order} from "../../src/models/order";
import {Product, ProductStore} from "../../src/models/product";
import {Users, UsersStore} from "../../src/models/users";

const orderStore = new OrderStore();
const userStore = new UsersStore();
const productStore = new ProductStore();

describe("Test orders store", ()=>{

    let userIdCreated:number;
    let productIdsCreated:number[] = [];
    let orderIdCreated: number;

    afterAll(async()=>{
        return await userStore.deleteAll();
    });

    beforeAll(async()=>{
        return await userStore.deleteAll();
    });

    it("create a user", async()=>{
        const user:Users = await userStore.create("jgrindall", "Mountain101");
        expect(user).toBeTruthy();
        expect(user.username).toEqual("jgrindall");
        userIdCreated = user.id;
    });

    it("index works", async ()=>{
        const products:Product[] = await productStore.index();
        expect(products).toBeTruthy();
        expect(products).toEqual([]);

        const orders:Order[] = await orderStore.index();
        expect(orders).toBeTruthy();
        expect(orders).toEqual([]);
    });

    it("create products works", async ()=>{
        const p1:Product = await productStore.create("football", 20);
        expect(p1).toBeTruthy();
        expect(p1.price).toEqual(20);

        const p2:Product = await productStore.create("mug", 6);
        expect(p2).toBeTruthy();
        expect(p2.price).toEqual(6);

        const p3:Product = await productStore.create("book", 10);
        expect(p3).toBeTruthy();
        expect(p3.price).toEqual(10);

        const products:Product[] = await productStore.index();
        expect(products).toBeTruthy();
        expect(products.length).toEqual(3);

        productIdsCreated = [p1.id, p2.id, p3.id];
    });

    it("create order works", async ()=>{
        const o1:Order = await orderStore.create("active", userIdCreated);
        expect(o1).toBeTruthy();
        expect(o1.status).toEqual("active");
        orderIdCreated = o1.id;

        const orders:Order[] = await orderStore.index();
        expect(orders).toBeTruthy();
        expect(orders.length).toEqual(1);

        const orders2:Order[] = await orderStore.getOrdersForUser(userIdCreated);
        expect(orders2).toBeTruthy();
        expect(orders2.length).toEqual(1);

        expect(orders[0].id).toEqual(orders2[0].id);

        const ids:{id:number}[] = await userStore.getWithOrders();
        expect(ids.length).toEqual(1);
        expect(ids[0].id).toEqual(userIdCreated);

    });

    it("list products", async ()=>{
        const products:Product[] = await orderStore.getProductsForOrder(orderIdCreated);
        expect(products).toBeTruthy();
        expect(products).toEqual([]);
    });

    it("adds a product", async ()=>{
        const product1:{id:number} = await orderStore.addProductToOrder(10, orderIdCreated, productIdsCreated[0]);
        const product2:{id:number} = await orderStore.addProductToOrder(6, orderIdCreated, productIdsCreated[1]);
        const product3:{id:number} = await orderStore.addProductToOrder(3, orderIdCreated, productIdsCreated[2]);

        expect(product1).toBeTruthy();
        expect(product2).toBeTruthy();
        expect(product3).toBeTruthy();

        expect(product2.id).toEqual(product1.id + 1);
        expect(product3.id).toEqual(product2.id + 1);

    });

    it("list products", async ()=>{
        const products:Product[] = await orderStore.getProductsForOrder(orderIdCreated);
        expect(products).toBeTruthy();
        expect(products.length).toEqual(3);
    });

    it("delete an order and associated data", async()=>{
        // when an order is deleted all linked data should be deleted
        const products:Product[] = await orderStore.getProductsForOrder(orderIdCreated);
        expect(products.length).toEqual(3);
        await orderStore.deleteOrder(orderIdCreated);
        const products2:Product[] = await orderStore.getProductsForOrder(orderIdCreated);
        expect(products2.length).toEqual(0);
        const orders2:Order[] = await orderStore.getOrdersForUser(userIdCreated);
        expect(orders2.length).toEqual(0);

        const ids:{id:number}[] = await userStore.getWithOrders();
        expect(ids).toEqual([]);
    });

    it("delete a user and associated data", async()=>{
        // when a user is deleted all orders should be deleted
        const o1:Order = await orderStore.create("active", userIdCreated);
        orderIdCreated = o1.id;

        const orders2:Order[] = await orderStore.getOrdersForUser(userIdCreated);
        expect(orders2.length).toEqual(1);

        const ids:{id:number}[] = await userStore.getWithOrders();
        expect(ids.length).toEqual(1);
        expect(ids[0].id).toEqual(userIdCreated);

        const product1:{id:number} = await orderStore.addProductToOrder(10, orderIdCreated, productIdsCreated[0]);
        const product2:{id:number} = await orderStore.addProductToOrder(6, orderIdCreated, productIdsCreated[1]);
        const product3:{id:number} = await orderStore.addProductToOrder(3, orderIdCreated, productIdsCreated[2]);

        const products:Product[] = await orderStore.getProductsForOrder(orderIdCreated);
        expect(products).toBeTruthy();
        expect(products.length).toEqual(3);

        // when a user is deleted all linked data should be deleted

        await userStore.delete(userIdCreated);
        const orders3:Order[] = await orderStore.getOrdersForUser(userIdCreated);
        expect(orders3.length).toEqual(0);

        const products2:Product[] = await orderStore.getProductsForOrder(orderIdCreated);
        expect(products2).toBeTruthy();
        expect(products2.length).toEqual(0);

        const ids2:{id:number}[] = await userStore.getWithOrders();
        expect(ids2).toEqual([]);

    });


});

