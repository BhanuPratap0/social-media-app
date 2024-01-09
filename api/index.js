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
const conversations = require('./routes/conversations')
const messages = require('./routes/messages')
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
app.use('/api/conversation', conversations);
app.use('/api/message', messages);

const PORT = process.env.PORT || 8800;
const server = app.listen(PORT, () => {
    console.log(`Backend Server is Running! on post: ${PORT} `)
})


const SOCKETPORT = 11000;

const io = require("socket.io")(server, {
    cors: {
        origin: "https://sociosync.netlify.app"
    },
});

let users = [];
const addUser = (userId, socketId) => {
    if (!users.some((user) => user.userId === userId)) {
        users.push({ userId, socketId });
    }
}

const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
}

const getUser = (userId) => {
    return users.find((user) => user.userId === userId);
}

io.on("connection", (socket) => {
    console.log("a user connected");

    //join user a room
    socket.on("setup", (userData) => {
        socket.join(userData._id);
        socket.emit("connected")
    });

    //join chat by user
    socket.on('join chat', (room) => {
        socket.join(room);
        console.log("User Joined room: " + room);
    });


    //is typing or not
    socket.on('typing', (room) => socket.in(room).emit("typing"));
    socket.on('stop typing', (room) => socket.in(room).emit("stop typing"));

    //take user and socketId from user
    socket.on("addUser", userId => {
        addUser(userId, socket.id);
        io.emit("getUsers", users);
    });

    //send and get message
    socket.on("sendMessage", ({ senderId, receiverId, text }) => {
        const user = getUser(receiverId);
        if (user) {
            io.to(user.socketId).emit("getMessage", {
                senderId,
                text,
            })
        }
    });

    //when disconnect
    socket.on("disconnect", () => {
        console.log("a user disconnected!");
        removeUser(socket.id);
        io.emit("getUsers", users);
    });
})
