require('dotenv').config()
const express = require('express');
const cors = require('cors');
const path = require('path')
const adminRouter = require('./routes/admin')
const userRouter = require('./routes/users')
const {connectDB} = require('./DB/data')

const app = express();

const port = process.env.PORT

app.use(cors())
app.use(express.static('dist'))
app.use(express.json());

app.use("/api/admin",adminRouter)
app.use("/api/users",userRouter)

connectDB()

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

app.listen(port, () => console.log(`Server running on port ${port}`));