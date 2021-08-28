const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const { addUser, removeUser, getUsers, getUsersInRoom } = require('./users')
const cors = require('cors');


const PORT = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(cors())

io.on("connection", (socket)=>{
    console.log("We have connection")

    socket.on("join", ({room}, callback)=>{
        const numberOfUsersInRoom = getUsersInRoom(room).length
        const { error, newUser} = addUser({
            id: socket.id,
            name : numberOfUsersInRoom===0 ? 'Dealer' : 'Player',
            room: room
        })

        if(error){
            console.log(error)
            return callback(error)
        }

        socket.join(newUser.room)

        io.to(newUser.room).emit('roomData', {room: newUser.room, users: getUsersInRoom(newUser.room)})
        socket.emit('currentUserData', {name: newUser.name})
        console.log(`${newUser.name} has joined`)
        callback()
    })

    socket.on("disconnect", ()=>{
        const user = removeUser(socket.id)
        if(user)
            io.to(user.room).emit('roomData', {room: user.room, users: getUsersInRoom(user.room)})
            console.log(`Someone has disconnected`)
    })
})


server.listen(PORT, ()=>{console.log(`Server has started on port ${PORT}`)})