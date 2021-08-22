import {Product, ProductStore} from "../../src/models/product";

const productStore = new ProductStore();

describe("Test products store - basic functionality", ()=>{

    let productIdsCreated:number[] = [];

    afterAll(async()=>{
        return await productStore.deleteAll();
    });

    beforeAll(async()=>{
        return await productStore.deleteAll();
    });

    it("lists products (empty)", async()=>{
        const products:Product[] = await productStore.index();
        expect(products).toBeTruthy();
        expect(products).toEqual([]);
    });

    it("create a product", async ()=>{
        const p1:Product = await productStore.create({name:"product1", price:10, category:"home"});
        expect(p1).toBeTruthy();
        expect(p1.price).toEqual(10);

        const p2:Product = await productStore.create({name:"product2", price:11, category:"home"});
        expect(p2).toBeTruthy();
        expect(p2.price).toEqual(11);

        const p3:Product = await productStore.create({name:"product3", price:12, category:"office"});
        expect(p3).toBeTruthy();
        expect(p3.price).toEqual(12);

        const products:Product[] = await productStore.index();
        expect(products).toBeTruthy();
        expect(products.length).toEqual(3);

        productIdsCreated = [p1.id, p2.id, p3.id];
    });

    it("finds one", async ()=>{
        const p1:Product = await productStore.find(productIdsCreated[0]);
        expect(p1).toBeTruthy();
        expect(p1.price).toEqual(10);
        expect(p1.category).toEqual("home");
        expect(p1.name).toEqual("product1");
    });

    it("finds by category", async ()=>{
        const pHome:Product[] = await productStore.findByCategory("home");
        expect(pHome.length).toEqual(2);
        expect(pHome[0].price).toEqual(10);
        expect(pHome[0].category).toEqual("home");
        expect(pHome[0].name).toEqual("product1");
        expect(pHome[1].price).toEqual(11);
        expect(pHome[1].category).toEqual("home");
        expect(pHome[1].name).toEqual("product2");

        const pOffice:Product[] = await productStore.findByCategory("office");
        expect(pOffice.length).toEqual(1);
        expect(pOffice[0].price).toEqual(12);
        expect(pOffice[0].category).toEqual("office");

        const pMissing:Product[] = await productStore.findByCategory("missing");
        expect(pMissing).toEqual([]);
    });

    it("deletes all", async ()=>{
        const products:Product[] = await productStore.deleteAll();

        expect(products).toBeTruthy();
        expect(products.length).toEqual(3);

        const products2:Product[] = await productStore.index();
        expect(products2).toEqual([]);
    });

});

