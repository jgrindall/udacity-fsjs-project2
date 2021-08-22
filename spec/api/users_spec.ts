import supertest from "supertest";
import app from "../../src/server";
import {Users} from "../../src/models/users";

const request = supertest(app);

describe("Test endpoint success", async () => {

    let idCreated: number;

    it("test list", async () => {
        const response = await request.get("/api/users");
        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    });

    it("test create", async () => {
        const user = {
            username:"jgrindall",
            password:"Mountain101"
        };
        const response = await request
            .post("/api/users")
            .send(user);
        expect(response.status).toBe(200);
        expect(response.body).toBeTruthy();
        const user2:Users = response.body as Users;
        idCreated = user2.id;
        expect(user2.username).toEqual("jgrindall");
        const response2 = await request.get("/api/users");
        expect(response2.status).toBe(200);
        const users = response2.body as Users[];
        expect(users.length).toEqual(1);
        expect(users[0].username).toEqual("jgrindall");
    });

    it("test auth", async () => {
        const user = {
            username:"jgrindall",
            password:"Mountain101"
        };
        const response = await request
            .post("/api/users/auth")
            .send(user);
        expect(response.status).toBe(200);
        expect(response.body).toBeTruthy();
        const user2:Users = response.body as Users;
        //const auth = response.headers["Authorization"];
        //const decoded:JwtPayload = jwt.decode(token) as JwtPayload;
        //expect(decoded).toBeTruthy();
        //expect(decoded['user']).toBeTruthy();
        expect(user2).toBeTruthy();
        expect(user2.username).toEqual("jgrindall");
    });

    it("test auth fail", async () => {
        const user = {
            username:"jgrindall",
            password:"Mountain"
        };
        const response = await request
            .post("/api/users/auth")
            .send(user);
        expect(response.status).toBe(401);
        expect(response.body).toEqual(null);
    });

    it("test auth fail2", async () => {
        const user = {
            username:"jg",
            password:"Mountain101"
        };
        const response = await request
            .post("/api/users/auth")
            .send(user);
        expect(response.status).toBe(401);
        expect(response.body).toEqual(null);
    });

    it("test delete", async () => {
        const response = await request.delete("/api/users/" + idCreated);
        expect(response.status).toBe(200);
        const delUser = response.body as Users;
        expect(delUser.username).toEqual("jgrindall");

        const response2 = await request.get("/api/users");
        expect(response2.status).toBe(200);
        expect(response2.body).toEqual([]);
    });

});
