
import 'dotenv/config'  
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

// const router = express.Router()

export let ADMINSECRET = process.env.ADMINSECRET;
export let USERSECRET = process.env.USERSECRET;

export const authenticateJwt = (req:Request, res:Response, next:NextFunction) => {

  // console.log(req.baseUrl);
  const token:string = req.cookies.token;
  const baseUrl = req.baseUrl
  let SECRET:string = "";

  if(baseUrl==="/api/admin"){
    SECRET = ADMINSECRET;
  }else if(baseUrl==="/api/users"){
    SECRET = USERSECRET
  }else{
    res.sendStatus(401);
  }

  if (token) {
    
    jwt.verify(token, SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      if (user && typeof user !=="string") {
        req.headers["username"] = user.username;
        next();
      } else {
        res.sendStatus(403);
      }
    });
  } else {
    res.sendStatus(401);
  }
};
