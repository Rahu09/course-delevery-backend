
const mongoose = require('mongoose');
const url = process.env.MONGODB_URI

// Define mongoose schemas
const userSchema = new mongoose.Schema({
  username: {type: String},
  password: String,
  purchasedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }]
});

const adminSchema = new mongoose.Schema({
  username: String,
  password: String
});

const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  imageLink: String,
  published: Boolean
});

const chapterSchema = new mongoose.Schema({
  html: String,
  videoLink: String
});

const contentSchema = new mongoose.Schema({
  id:String,
  chapters: [chapterSchema]
});


// Define mongoose models
const User = mongoose.model('User', userSchema);
const Admin = mongoose.model('Admin', adminSchema);
const Course = mongoose.model('Course', courseSchema);
const Content = mongoose.model('Content', contentSchema);

// Connect to MongoDB
const connectDB = ()=>{
  mongoose.connect(url, { 
    useNewUrlParser: true, useUnifiedTopology: true, dbName: "courses" 
  })
  .then(()=>console.log('database connected'))
  .catch((e)=>console.log(e))
}

module.exports = {
  User,
  Admin,
  Course,
  Content,
  connectDB
}