import express from "express";
import jwt from 'jsonwebtoken';
import { Admin, Course, Content } from "../DB/data";
import { authenticateJwt, ADMINSECRET } from "../middleware/auth";

const router = express.Router()
const SECRET = ADMINSECRET
router.get("/me", authenticateJwt, async (req, res) => {
  const { username } = req.headers
  const admin = await Admin.findOne({ username: username });
  if (!admin) {
    res.status(403).json({ msg: "Admin doesnt exist" })
    return
  }
  res.json({
    username: admin.username
  })
});

router.post('/signup', (req, res) => {
  const { username, password } = req.body;
  function callback(admin: any): void {
    if (admin) {
      res.status(403).json({ message: 'Admin already exists' });
    } else {
      const obj = { username: username, password: password };
      const newAdmin = new Admin(obj);
      newAdmin.save();
      const token = jwt.sign({ username: username, role: 'admin' }, SECRET, { expiresIn: '6h' });
      res
        .status(201)
        .cookie("token", token, {
          httpOnly: false,
          maxAge: 60 * 60 * 1000
        })
        .json({ message: 'Admin created successfully' });
    }
  }
  Admin.findOne({ username }).then(callback);
});

router.post('/login', async (req, res) => {
  const { username, password } = req.headers;
  const admin = await Admin.findOne({ username, password });
  if (admin) {
    const token = jwt.sign({ username, role: 'admin' }, SECRET, { expiresIn: '1h' });
    res
      .status(201)
      .cookie("token", token, {
        httpOnly: false,
        maxAge: 60 * 60 * 1000
      })
      .json({ message: 'Logged in successfully' });
  } else {
    res.status(403).json({ message: 'Invalid username or password' });
  }
});

router.post('/courses', authenticateJwt, async (req, res) => {
  const course = new Course(req.body);
  await course.save();
  res.json({ message: 'Course created successfully', courseId: course.id });
});

router.put('/courses/:courseId', authenticateJwt, async (req, res) => {
  const course = await Course.findByIdAndUpdate(req.params.courseId, req.body, { new: true });
  if (course) {
    res.json({ message: 'Course updated successfully' });
  } else {
    res.status(404).json({ message: 'Course not found' });
  }
});

router.get('/courses', authenticateJwt, async (req, res) => {
  const courses = await Course.find({});
  res.json({ courses });
});

router.get('/course/:courseId', authenticateJwt, async (req, res) => {
  const courseId = req.params.courseId;
  const course = await Course.findById(courseId);
  res.json({ course });
});

router.get('/course/:courseId/content', authenticateJwt, async (req, res) => {
  const courseId = req.params.courseId;
  const course = await Content.findOne({ id: courseId })
  res.json(course)
})
router.post('/course/:courseId/content', authenticateJwt, async (req, res) => {
  const courseId = req.params.courseId;
  const course = await Content.findOne({ id: courseId })
  if (course) {
    res.json({ message: 'Course already exist' });
  } else {
    const content = new Content(req.body);
    await content.save();
    res.json({ message: 'Course created successfully', contrntId: content.id });
  }

})
router.put('/course/:courseId/content', authenticateJwt, async (req, res) => {
  const { courseId } = req.params;
  const course = await Content.findOne({ id: courseId })

  if (course === null) {
    res.status(404).json({ message: 'Course not found' });
  }
  else {
    course.chapters.push(req.body);

    const newCourse = await course.save();

    if (newCourse) {
      res.json({
        message: 'Course updated successfully',
        content: newCourse
      });
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  }

})
export default router