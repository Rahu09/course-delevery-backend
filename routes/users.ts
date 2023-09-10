import express from "express";
import { User, Course, Content } from "../DB/data";
import { authenticateJwt, USERSECRET } from "../middleware/auth";
import jwt from "jsonwebtoken";

const router = express.Router();

// User routes
const SECRET = USERSECRET;
router.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (user) {
    res.status(403).json({ message: "User already exists" });
  } else {
    const newUser = new User({ username, password });
    await newUser.save();
    const token = jwt.sign({ username, role: "user" }, SECRET, {
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
});

router.post("/login", async (req, res) => {
  const { username, password } = req.headers;
  const user = await User.findOne({ username, password });
  if (user) {
    const token = jwt.sign({ username, role: "user" }, SECRET, {
      expiresIn: "6h",
    });
    res
      .status(201)
      .cookie("token", token, {
        httpOnly: false,
        maxAge: 60 * 60 * 1000,
      })
      .json({ message: "Logged in successfully" });
  } else {
    res.status(403).json({ message: "Invalid username or password" });
  }
});

router.get("/courses", async (req, res) => {
  const courses = await Course.find({ published: true });
  res.json({ courses });
});

router.get("/course/:courseId", authenticateJwt, async (req, res) => {
  const courseId = req.params.courseId;
  const course = await Course.findById(courseId);
  res.json({ course });
});

router.get("/course/:courseId/content", authenticateJwt, async (req, res) => {
  const courseId = req.params.courseId;
  const course = await Content.findOne({ id: courseId });
  res.json(course);
});

router.post("/courses/:courseId", authenticateJwt, async (req, res) => {
  const course = await Course.findById(req.params.courseId);
  console.log(course);
  if (course) {
    const { username } = req.headers;
    const user = await User.findOne({ username: username });
    if (user) {
      user.purchasedCourses.push(course._id);
      await user.save();
      res.json({ message: "Course purchased successfully" });
    } else {
      res.status(403).json({ message: "User not found" });
    }
  } else {
    res.status(404).json({ message: "Course not found" });
  }
});

router.get("/purchasedCourses", authenticateJwt, async (req, res) => {
  const { username } = req.headers;
  const user = await User.findOne({ username: username }).populate(
    "purchasedCourses"
  );
  if (user) {
    res.json({ purchasedCourses: user.purchasedCourses || [] });
  } else {
    res.status(403).json({ message: "User not found" });
  }
});

export default router;
