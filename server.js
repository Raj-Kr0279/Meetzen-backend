const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
require("dotenv").config();

const companyRoutes = require("./routes/company")
const authRoutes = require("./routes/auth")
const userRoutes = require("./routes/user")
const meetingRoutes = require("./routes/meeting")

const cookieParser = require("cookie-parser")
const { rateLimit } = require("express-rate-limit")

const app = express();

app.set("trust proxy", 1);

app.use(cors({
  credentials: true
}))

app.use(express.json());
app.use(cookieParser());

const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 60,
  standardHeaders: true,
  legacyHeaders: false,
  statusCode: 429,
  message: {
    success: false,
    message: "Too many requests. Please try again later."
  }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  statusCode: 429,
  message: {
    success: false,
    message: "Too many login/register attempts. Please try again later."
  }
});

// Apply API-wide limiter early (protects / and all following routes)
app.use(apiLimiter);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.get("/", (req, res) => {
  res.send("hello-world")
})

app.use("/api/company", companyRoutes)
app.use("/api/auth", authLimiter, authRoutes)
// Extra protection for login on /api/user/login
const userLoginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  limit: 25, // 5 attempts per IP
  standardHeaders: true,
  legacyHeaders: false,
  statusCode: 429,
  message: {
    success: false,
    message: "Too many login attempts. Please try again later."
  }
});

app.use("/api/user", userLoginLimiter, userRoutes)

app.use("/api/meeting", meetingRoutes)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("server running " + PORT)
})

