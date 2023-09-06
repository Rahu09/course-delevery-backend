"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const admin_1 = __importDefault(require("./routes/admin"));
const users_1 = __importDefault(require("./routes/users"));
const data_1 = require("./DB/data");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
// const port = process.env.PORT
app.use((0, cors_1.default)());
app.use(express_1.default.static("dist"));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use("/api/admin", admin_1.default);
app.use("/api/users", users_1.default);
(0, data_1.connectDB)();
app.get("*", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "dist/index.html"));
});
app.listen(30000, () => console.log(`Server running on port 3000`));
