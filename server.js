const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app)
const io = new Server(server)

const PORT = 4000;

app.use(express.static(path.join(__dirname, 'public')));

// Handle socket connection
io.on('connection', (socket) => {
    console.log(`A user connected: ${socket.id}`);

    // Broadcast a doodle to other users
    socket.on('draw', (data) => {
        socket.broadcast.emit('draw', data); // Send to all other users
    });

    // Notify when a user disconnects
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
