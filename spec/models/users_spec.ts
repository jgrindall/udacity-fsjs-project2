import {Users, UsersStore} from "../../src/models/users";
import {ProductStore} from "../../src/models/product";

const userStore = new UsersStore();
const productStore = new ProductStore();

let idCreated:number;

describe("Test users store", ()=>{

    afterAll(async()=>{
        await userStore.deleteAll();
        return await productStore.deleteAll();
    });

    beforeAll(async()=>{
        await userStore.deleteAll();
        return await productStore.deleteAll();
    });

    it("index works", async ()=>{
        const users:Users[] = await userStore.index();
        expect(users).toBeTruthy();
        expect(users).toEqual([]);
    });

    it("create works", async ()=>{
        const user:Users = await userStore.create({firstName:"paul", lastName:"smith", password:"s0meth1ng"});
        expect(user).toBeTruthy();
        expect(user.firstName).toEqual("paul");
        expect(user.password).not.toEqual("s0meth1ng");
        idCreated = user.id;

        const users:Users[] = await userStore.index();
        expect(users).toBeTruthy();
        expect(users.length).toEqual(1);
    });

    it("auth works - success", async ()=>{
        const user = await userStore.authenticate("paul smith", "s0meth1ng");
        expect(user).toBeTruthy();
        expect(user as Users).toBeTruthy();
        expect((user as Users).firstName).toEqual("paul");
    });

    it("auth works - fail, wrong password", async ()=>{
        const user = await userStore.authenticate("paul smith", "not the password");
        expect(user).toEqual(null);
    });

    it("auth works - fail missing user", async ()=>{
        const user = await userStore.authenticate("someone else", "s0meth1ng");
        expect(user).toEqual(null);
    });

    it("del one user works", async ()=>{
        const user = await userStore.delete(idCreated);
        expect(user).toBeTruthy();
        const users:Users[] = await userStore.index();
        expect(users).toBeTruthy();
        expect(users).toEqual([]);
    });

    it("del all works", async ()=>{
        await userStore.create({firstName:"paul", lastName:"smith", password:"s0meth1ng"});
        const users:Users[] = await userStore.index();
        expect(users.length).toEqual(1);
        let usersDel:Users[] = await userStore.deleteAll();
        expect(usersDel.length).toEqual(1);
        const users2 = await userStore.index();
        expect(users2).toEqual([]);
    });

});
