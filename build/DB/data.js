"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = exports.Content = exports.Course = exports.Admin = exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
// const url = process.env.MONGODB_URI
// Define mongoose schemas
const userSchema = new mongoose_1.default.Schema({
    username: { type: String },
    password: String,
    purchasedCourses: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Course" }],
});
const adminSchema = new mongoose_1.default.Schema({
    username: String,
    password: String,
});
const courseSchema = new mongoose_1.default.Schema({
    title: String,
    description: String,
    price: Number,
    imageLink: String,
    published: Boolean,
});
const chapterSchema = new mongoose_1.default.Schema({
    name: String,
    description: String,
    html: String,
    videoLink: String,
});
const contentSchema = new mongoose_1.default.Schema({
    id: String,
    chapters: [chapterSchema],
});
// Define mongoose models
exports.User = mongoose_1.default.model("User", userSchema);
exports.Admin = mongoose_1.default.model("Admin", adminSchema);
exports.Course = mongoose_1.default.model("Course", courseSchema);
exports.Content = mongoose_1.default.model("Content", contentSchema);
// Connect to MongoDB
const connectDB = () => {
    mongoose_1.default
        .connect("mongodb+srv://tiwarirahul0809:Hadies%4008@cluster0.mujrrn0.mongodb.net/courses", {
        dbName: "courses",
    })
        .then(() => console.log("database connected"))
        .catch((e) => console.log(e));
};
exports.connectDB = connectDB;
