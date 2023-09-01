"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateJwt = exports.USERSECRET = exports.ADMINSECRET = void 0;
require("dotenv/config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// const router = express.Router()
exports.ADMINSECRET = process.env.ADMINSECRET;
exports.USERSECRET = process.env.USERSECRET;
const authenticateJwt = (req, res, next) => {
    // console.log(req.baseUrl);
    const token = req.cookies.token;
    const baseUrl = req.baseUrl;
    let SECRET = "";
    if (baseUrl === "/api/admin") {
        SECRET = exports.ADMINSECRET;
    }
    else if (baseUrl === "/api/users") {
        SECRET = exports.USERSECRET;
    }
    else {
        res.sendStatus(401);
    }
    if (token) {
        jsonwebtoken_1.default.verify(token, SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            if (user && typeof user !== "string") {
                req.headers["username"] = user.username;
                next();
            }
            else {
                res.sendStatus(403);
            }
        });
    }
    else {
        res.sendStatus(401);
    }
};
exports.authenticateJwt = authenticateJwt;
