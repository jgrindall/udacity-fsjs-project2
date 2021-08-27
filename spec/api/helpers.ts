import {Users} from "../../src/models/users";

export const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJmaXJzdE5hbWUiOiJwYXVsIiwibGFzdE5hbWUiOiJzbWl0aCIsInBhc3N3b3JkIjoiJDJiJDEwJEJTYVRJWncwL1JsY2xNcFRLR1dXNnUuNExQWEpTS2pPRjJxVVNEM0ozR2tacm1haHBvdlRxIn0sImlhdCI6MTYyOTgyMjIwOH0.DvpQubZf05gHdg5ex4PeDhC3fXrWht7itkMckAVruCk";

export const testingUser: Omit<Users, "id"> = {
    firstName: "paul",
    lastName: "smith",
    password: "s0meth1ng"
};
