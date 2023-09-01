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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const data_1 = require("../DB/data");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
const SECRET = auth_1.ADMINSECRET;
router.get("/me", auth_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username } = req.headers;
    const admin = yield data_1.Admin.findOne({ username: username });
    if (!admin) {
        res.status(403).json({ msg: "Admin doesnt exist" });
        return;
    }
    res.json({
        username: admin.username
    });
}));
router.post('/signup', (req, res) => {
    const { username, password } = req.body;
    function callback(admin) {
        if (admin) {
            res.status(403).json({ message: 'Admin already exists' });
        }
        else {
            const obj = { username: username, password: password };
            const newAdmin = new data_1.Admin(obj);
            newAdmin.save();
            const token = jsonwebtoken_1.default.sign({ username: username, role: 'admin' }, SECRET, { expiresIn: '6h' });
            res
                .status(201)
                .cookie("token", token, {
                httpOnly: false,
                maxAge: 60 * 60 * 1000
            })
                .json({ message: 'Admin created successfully' });
        }
    }
    data_1.Admin.findOne({ username }).then(callback);
});
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.headers;
    const admin = yield data_1.Admin.findOne({ username, password });
    if (admin) {
        const token = jsonwebtoken_1.default.sign({ username, role: 'admin' }, SECRET, { expiresIn: '1h' });
        res
            .status(201)
            .cookie("token", token, {
            httpOnly: false,
            maxAge: 60 * 60 * 1000
        })
            .json({ message: 'Logged in successfully' });
    }
    else {
        res.status(403).json({ message: 'Invalid username or password' });
    }
}));
router.post('/courses', auth_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const course = new data_1.Course(req.body);
    yield course.save();
    res.json({ message: 'Course created successfully', courseId: course.id });
}));
router.put('/courses/:courseId', auth_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const course = yield data_1.Course.findByIdAndUpdate(req.params.courseId, req.body, { new: true });
    if (course) {
        res.json({ message: 'Course updated successfully' });
    }
    else {
        res.status(404).json({ message: 'Course not found' });
    }
}));
router.get('/courses', auth_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const courses = yield data_1.Course.find({});
    res.json({ courses });
}));
router.get('/course/:courseId', auth_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const courseId = req.params.courseId;
    const course = yield data_1.Course.findById(courseId);
    res.json({ course });
}));
router.get('/course/:courseId/content', auth_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const courseId = req.params.courseId;
    const course = yield data_1.Content.findOne({ id: courseId });
    res.json(course);
}));
router.post('/course/:courseId/content', auth_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const courseId = req.params.courseId;
    const course = yield data_1.Content.findOne({ id: courseId });
    if (course) {
        res.json({ message: 'Course already exist' });
    }
    else {
        const content = new data_1.Content(req.body);
        yield content.save();
        res.json({ message: 'Course created successfully', contrntId: content.id });
    }
}));
router.put('/course/:courseId/content', auth_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { courseId } = req.params;
    const course = yield data_1.Content.findOne({ id: courseId });
    if (course === null) {
        res.status(404).json({ message: 'Course not found' });
    }
    else {
        course.chapters.push(req.body);
        const newCourse = yield course.save();
        if (newCourse) {
            res.json({
                message: 'Course updated successfully',
                content: newCourse
            });
        }
        else {
            res.status(404).json({ message: 'Course not found' });
        }
    }
}));
exports.default = router;
