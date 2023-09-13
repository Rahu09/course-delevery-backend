import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import adminRouter from "./routes/admin";
import userRouter from "./routes/users";
import { connectDB } from "./DB/data";
import cookieParser from "cookie-parser";

const app = express();

const port = process.env.PORT;

app.use(cors());
app.use(express.static("dist"));
app.use(express.json());
app.use(cookieParser());

app.use("/api/admin", adminRouter);
app.use("/api/users", userRouter);

connectDB();

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist/index.html"));
});

app.listen(port, () => console.log(`Server running on port ${port}`));
