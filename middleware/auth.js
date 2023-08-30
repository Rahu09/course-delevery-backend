require('dotenv').config()
const express =  require("express");
const jwt = require("jsonwebtoken")

const router = express.Router()

const ADMINSECRET = process.env.ADMINSECRET;
const USERSECRET = process.env.USERSECRET;

const authenticateJwt = (req, res, next) => {
  console.log(req.baseUrl);
  const baseUrl = req.baseUrl
  let SECRET = "";
  if(baseUrl==="/api/admin"){
    SECRET = ADMINSECRET;
  }else if(baseUrl==="/api/users"){
    SECRET = USERSECRET
  }else{
    res.sendStatus(401);
  }
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

module.exports = {
  authenticateJwt,
  ADMINSECRET,
  USERSECRET
}