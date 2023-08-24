const express = require("express");
const jwt = require('jsonwebtoken');
const { Admin, Course, Content } = require("../DB/data");
const { authenticateJwt, SECRET } = require("../middleware/auth");

const router = express.Router()

router.get("/me", authenticateJwt, async (req, res) => {
  const admin = await Admin.findOne({ username: req.user.username });
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
  function callback(admin) {
    if (admin) {
      res.status(403).json({ message: 'Admin already exists' });
    } else {
      const obj = { username: username, password: password };
      const newAdmin = new Admin(obj);
      newAdmin.save();
      const token = jwt.sign({ username, role: 'admin' }, SECRET, { expiresIn: '1h' });
      res.json({ message: 'Admin created successfully', token });
    }
  }
  Admin.findOne({ username }).then(callback);
});

router.post('/login', async (req, res) => {
  const { username, password } = req.headers;
  const admin = await Admin.findOne({ username, password });
  if (admin) {
    const token = jwt.sign({ username, role: 'admin' }, SECRET, { expiresIn: '1h' });
    res.json({ message: 'Logged in successfully', token });
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
})
module.exports = router