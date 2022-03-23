const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const socket_io = require('socket.io');
const cors = require('cors');

app.use(cors());
app.use(express.json());
const io = socket_io(server, {
    cors: {
        origin: ['http://localhost:3000']
    }
});

const quests = [
    {room: 'Laliga', time: 10000, game: 'This is laliga'},
    {room: 'Prem', time: 15000, game: 'This is Prem'},
    {room: 'UCL', time: 20000, game: 'This is UCL'},
    {room: 'UEL', time: 25000, game: 'This is UEL'},
    {room: 'BL', time: 30000, game: 'This is BL'},
]

io.on("connection", (socket) => {
    console.log("A user has connected with socket id: " + socket.id);
    
    socket.on("join-room", (data, callback) => {
        socket.join(data.room);
        callback(`Joined ${data.room}`);
    });

    quests.map(item => setTimeout(() => {
            socket.to(item.room).emit("game", item);
        }, item.time)
    )

    socket.on("disconnect", () => console.log(socket.id + " disconnected"))
});

server.listen('5000', () => {
    console.log("Server is listening to port *:5000")
});
