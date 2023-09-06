import mongoose from "mongoose";
// const url = process.env.MONGODB_URI

// Define mongoose schemas
const userSchema = new mongoose.Schema({
  username: { type: String },
  password: String,
  purchasedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
});

const adminSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  imageLink: String,
  published: Boolean,
});

const chapterSchema = new mongoose.Schema({
  name: String,
  description: String,
  html: String,
  videoLink: String,
});

const contentSchema = new mongoose.Schema({
  id: String,
  chapters: [chapterSchema],
});

// Define mongoose models
export const User = mongoose.model("User", userSchema);
export const Admin = mongoose.model("Admin", adminSchema);
export const Course = mongoose.model("Course", courseSchema);
export const Content = mongoose.model("Content", contentSchema);

// Connect to MongoDB
export const connectDB = () => {
  mongoose
    .connect(
      "mongodb+srv://tiwarirahul0809:Hadies%4008@cluster0.mujrrn0.mongodb.net/courses",
      {
        dbName: "courses",
      }
    )
    .then(() => console.log("database connected"))
    .catch((e) => console.log(e));
};
