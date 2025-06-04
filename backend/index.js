const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
require('dotenv').config();

const connectDB = require('./src/config/db');
const authRoutes = require("./src/routes/authRoutes");
const taskRoutes = require("./src/routes/taskRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// DB Connection
connectDB();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use(mongoSanitize());
app.use(xss());

// Routes
app.use("/api", authRoutes);
app.use("/api/tasks", taskRoutes);

// Server
app.listen(PORT, () => {
  console.log(`Server Running on port ${PORT}`);
});
