"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const data_1 = require("../DB/data");
const auth_1 = require("../middleware/auth");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = express_1.default.Router();
// User routes
const SECRET = auth_1.USERSECRET;
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const user = yield data_1.User.findOne({ username });
    if (user) {
        res.status(403).json({ message: "User already exists" });
    }
    else {
        const newUser = new data_1.User({ username, password });
        yield newUser.save();
        const token = jsonwebtoken_1.default.sign({ username, role: "user" }, SECRET, {
            expiresIn: "6h",
        });
        res
            .status(201)
            .cookie("token", token, {
            httpOnly: false,
            maxAge: 60 * 60 * 1000,
        })
            .json({ message: "User created successfully" });
    }
}));
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.headers;
    const user = yield data_1.User.findOne({ username, password });
    if (user) {
        const token = jsonwebtoken_1.default.sign({ username, role: "user" }, SECRET, {
            expiresIn: "6h",
        });
        res
            .status(201)
            .cookie("token", token, {
            httpOnly: false,
            maxAge: 60 * 60 * 1000,
        })
            .json({ message: "Logged in successfully" });
    }
    else {
        res.status(403).json({ message: "Invalid username or password" });
    }
}));
router.get("/courses", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const courses = yield data_1.Course.find({ published: true });
    res.json({ courses });
}));
router.get("/course/:courseId", auth_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const courseId = req.params.courseId;
    const course = yield data_1.Course.findById(courseId);
    res.json({ course });
}));
router.get("/course/:courseId/content", auth_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const courseId = req.params.courseId;
    const course = yield data_1.Content.findOne({ id: courseId });
    res.json(course);
}));
router.post("/courses/:courseId", auth_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const course = yield data_1.Course.findById(req.params.courseId);
    console.log(course);
    if (course) {
        const { username } = req.headers;
        const user = yield data_1.User.findOne({ username: username });
        if (user) {
            user.purchasedCourses.push(course._id);
            yield user.save();
            res.json({ message: "Course purchased successfully" });
        }
        else {
            res.status(403).json({ message: "User not found" });
        }
    }
    else {
        res.status(404).json({ message: "Course not found" });
    }
}));
router.get("/purchasedCourses", auth_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username } = req.headers;
    const user = yield data_1.User.findOne({ username: username }).populate("purchasedCourses");
    if (user) {
        res.json({ purchasedCourses: user.purchasedCourses || [] });
    }
    else {
        res.status(403).json({ message: "User not found" });
    }
}));
exports.default = router;
