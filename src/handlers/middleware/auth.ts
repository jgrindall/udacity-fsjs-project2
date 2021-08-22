import express from "express";
import jwt from "jsonwebtoken";

const JWT_TOKEN_SECRET:string = process.env.JWT_TOKEN_SECRET as string;

const verifyAuth = (req: express.Request, res: express.Response, next:express.NextFunction) => {
    try {
        const authorizationHeader:string = req.headers.authorization as string;
        const token:string = authorizationHeader ? authorizationHeader.split(' ')[1] : "";
        const verify = jwt.verify(token, JWT_TOKEN_SECRET);
        if(verify){
            next()
        }
        else{
            res
                .status(401)
                .json(null);
        }
    }
    catch (error) {
        res
            .status(401)
            .json(null);
    }
};

export default verifyAuth;