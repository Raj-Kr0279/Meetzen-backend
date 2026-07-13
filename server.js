const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
require('dotenv').config();
const companyRoutes = require("./routes/company");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const meetingRoutes = require("./routes/meeting");
const Meeting = require("./models/Meeting");

const app = express();
app.use(cors());
app.use(express.json());
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));
app.get("/",(req, res)=>{
try {
   res.send("hello-world") 
} catch (error) {
    res.send(error)
}
})

app.use('/api/company', companyRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/meeting', meetingRoutes)

const port = 5000;
app.listen(port, ()=>{
    console.log("server running" + port)
})