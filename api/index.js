const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./db');
const userRoutes = require('./routes/usersRoutes') 
const authRoutes = require('./routes/authRoutes') 
const postRoutes = require('./routes/postRoutes') 
var cors = require('cors')

app.use(cors());
app.use(express.json())

dotenv.config();
connectDB();

//middlewares
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/post', postRoutes);

const PORT = process.env.PORT || 8800;
app.listen(PORT, ()=>{
    console.log(`Backend Server is Running! on post: ${PORT} `)
})
