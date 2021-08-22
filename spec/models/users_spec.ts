import {Users, UsersStore} from "../../src/models/users";
const store = new UsersStore();

let idCreated:number;

describe("Test users store", ()=>{

    afterAll(async()=>{
        return await store.deleteAll();
    });

    beforeAll(async()=>{
        return await store.deleteAll();
    });

    it("index works", async ()=>{
        const users:Users[] = await store.index();
        expect(users).toBeTruthy();
        expect(users).toEqual([]);
    });

    it("create works", async ()=>{
        const user:Users = await store.create({firstName:"paul", lastName:"smith", password:"s0meth1ng"});
        expect(user).toBeTruthy();
        expect(user.firstName).toEqual("paul");
        expect(user.password).not.toEqual("s0meth1ng");
        idCreated = user.id;

        const users:Users[] = await store.index();
        expect(users).toBeTruthy();
        expect(users.length).toEqual(1);
    });

    it("auth works - success", async ()=>{
        const user = await store.authenticate("paul smith", "s0meth1ng");
        expect(user).toBeTruthy();
        expect(user as Users).toBeTruthy();
        expect((user as Users).firstName).toEqual("paul");
    });

    it("auth works - fail, wrong password", async ()=>{
        const user = await store.authenticate("paul smith", "not the password");
        expect(user).toEqual(null);
    });

    it("auth works - fail missing user", async ()=>{
        const user = await store.authenticate("someone else", "s0meth1ng");
        expect(user).toEqual(null);
    });

    it("del one user works", async ()=>{
        const user = await store.delete(idCreated);
        expect(user).toBeTruthy();
        const users:Users[] = await store.index();
        expect(users).toBeTruthy();
        expect(users).toEqual([]);
    });

    it("del all works", async ()=>{
        await store.create({firstName:"paul", lastName:"smith", password:"s0meth1ng"});
        const users:Users[] = await store.index();
        expect(users.length).toEqual(1);
        let usersDel:Users[] = await store.deleteAll();
        expect(usersDel.length).toEqual(1);
        const users2 = await store.index();
        expect(users2).toEqual([]);
    });

});
