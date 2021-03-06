import supertest from "supertest";
import app from "../../src/server";
import {Users, UsersStore} from "../../src/models/users";
import {ProductStore} from "../../src/models/product";
import {token, testingUser} from "./helpers";
import jwt, {JwtPayload} from "jsonwebtoken";

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


    let idCreated: number;

    it("test list", async () => {
        const response = await request
            .get("/api/users")
            .set('Authorization', 'Bearer ' + token)

        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    });

    it("test list auth fail", async()=>{
        const response = await request
            .get("/api/users");

        expect(response.status).toBe(401);
        expect(response.body).toBeNull();
    });

    it("test create - invalid format", async () => {
        const user:any = {
            something:123
        };
        const response = await request
            .post("/api/users")
            .set('Authorization', 'Bearer ' + token)
            .send(user);
        expect(response.status).toBe(403);
        expect(response.body).toBeNull();
    });

    it("test create", async () => {
        const user:Omit<Users, "id"> = testingUser;

        const response = await request
            .post("/api/users")
            .set('Authorization', 'Bearer ' + token)
            .send(user);

        expect(response.status).toBe(200);
        expect(response.body).toBeTruthy();
        const user2:Users = response.body as Users;

        expect(user2.firstName).toEqual(user.firstName);
        const response2 = await request
            .get("/api/users")
            .set('Authorization', 'Bearer ' + token);

        expect(response2.status).toBe(200);
        const users = response2.body as Users[];

        expect(users.length).toEqual(1);
        expect(users[0].firstName).toEqual(user.firstName);

        idCreated = user2.id;
    });

    it("test auth", async () => {
        const user = {
            username: testingUser.firstName + " " + testingUser.lastName,
            password: testingUser.password
        };
        const response = await request
            .post("/api/users/auth")
            .send(user);

        expect(response.status).toBe(200);
        expect(response.body).toBeTruthy();
        const _token:string = response.body.access_token;
        expect(_token).toBeTruthy();
        
        const decoded:JwtPayload = jwt.decode(_token) as JwtPayload;
        expect(decoded).toBeTruthy();
        expect(decoded.user).toBeTruthy();
        const user2 = decoded.user as Users;

        expect(user2.firstName).toBe(testingUser.firstName);
        expect(user2.lastName).toBe(testingUser.lastName);

    });

    it("test auth fail, incorrect password", async () => {
        const user = {
            username:"paul smith",
            password:"not the password"
        };
        const response = await request
            .post("/api/users/auth")
            .send(user);

        expect(response.status).toBe(401);
        expect(response.body).toBeNull();
    });

    it("test auth fail, incorrect username", async () => {
        const user = {
            username:"someone else",
            password:"s0meth1ng"
        };
        const response = await request
            .post("/api/users/auth")
            .send(user);

        expect(response.status).toBe(401);
        expect(response.body).toBeNull();
    });

    it("test show", async () => {
        const response = await request
            .get("/api/users/" + idCreated)
            .set('Authorization', 'Bearer ' + token);

        expect(response.status).toBe(200);
        expect(response.body).toBeTruthy();
        const user2:Users = response.body as Users;

        expect(user2.firstName).toEqual("paul");
    });

    it("test show - auth fail", async () => {
        const response = await request
            .get("/api/users/" + idCreated);

        expect(response.status).toBe(401);
        expect(response.body).toBeNull();
    });

    it("test delete", async () => {
        const response = await request
            .delete("/api/users/" + idCreated)
            .set('Authorization', 'Bearer ' + token);

        expect(response.status).toBe(200);
        const delUser = response.body as Users;

        expect(delUser.firstName).toEqual("paul");

        const response2 = await request
            .get("/api/users")
            .set('Authorization', 'Bearer ' + token);

        expect(response2.status).toBe(200);
        expect(response2.body).toEqual([]);
    });

    it("test delete - auth fail", async () => {
        const response = await request
            .delete("/api/users/" + idCreated);

        expect(response.status).toBe(401);
        expect(response.body).toBeNull();
    });

});
