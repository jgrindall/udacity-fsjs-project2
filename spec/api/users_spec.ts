import supertest from "supertest";
import app from "../../src/server";
import {Users, UsersStore} from "../../src/models/users";
const userStore = new UsersStore();

const request = supertest(app);

describe("Test endpoint success", async () => {

    let idCreated: number;

    it("test list", async () => {
        const response = await request.get("/api/users");
        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    });

    it("test create", async () => {
        const user:Omit<Users, "id"> = {
            firstName:"paul",
            lastName:"smith",
            password:"s0meth1ng"
        };

        const response = await request
            .post("/api/users")
            .send(user);

        expect(response.status).toBe(200);
        expect(response.body).toBeTruthy();
        const user2:Users = response.body as Users;
        expect(user2.firstName).toEqual(user.firstName);
        const response2 = await request.get("/api/users");
        expect(response2.status).toBe(200);
        const users = response2.body as Users[];
        expect(users.length).toEqual(1);
        expect(users[0].firstName).toEqual(user.firstName);

        idCreated = user2.id;
    });

    it("test auth", async () => {
        const user = {
            username:"paul smith",
            password:"s0meth1ng"
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
        expect(user2.firstName).toEqual("paul");
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
        expect(response.body).toEqual(null);
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
        expect(response.body).toEqual(null);
    });

    it("test delete", async () => {
        const response = await request.delete("/api/users/" + idCreated);
        expect(response.status).toBe(200);
        const delUser = response.body as Users;
        expect(delUser.firstName).toEqual("paul");

        const response2 = await request.get("/api/users");
        expect(response2.status).toBe(200);
        expect(response2.body).toEqual([]);
    });

});
