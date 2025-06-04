const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');
const connectDB = require('./src/config/db');
const authRoutes = require("./src/routes/authRoutes");
const taskRoutes = require("./src/routes/taskRoutes");

require('dotenv').config();
const app = express();

const PORT = process.env.PORT || 5000;



//DBConnection
connectDB();
app.use(cors());
app.use(express.json());

//routes
app.use("/api", authRoutes);
app.use("/api/tasks", taskRoutes)

app.listen(PORT, () =>{
    console.log(`Server Running on port ${PORT}`)
})


