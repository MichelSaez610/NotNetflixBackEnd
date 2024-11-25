const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const socketIo = require('socket.io');

const app = express();
const port = 3333;

app.use(express.json());
app.use(cors());

const io = socketIo(app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
}), {
    cors: {
        origin: 'http://localhost:4200', // Allowing connection from Angular client
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type'],
        credentials: true
    }
});

var client_choice = ""
var genCode = ""

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('message', (msg) => {
        console.log('Received message from client:', msg);
        io.emit('message', msg); 

        client_choice = msg
        genCode = randomCode();
        console.log('client choice: ' + client_choice);
        console.log('Generated code: ' + genCode);

        socket.emit('generatedCode', genCode);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });

    socket.on('connect_error', (err) => {
        console.log(`Connection error: ${err.message}`);
    });
});

app.get('/api/video/getAllVideos', async (req, res) => {
    try {
        const videoDir = path.join(__dirname, '../videos');
        const videosSource = fs.readdirSync(videoDir);

        const videoJson = videosSource.map(video => {
            const videoName = video.split('.')[0];
            return {
                name: videoName,
            };
        });

        res.json(videoJson);
    } catch (error) {
        console.log('Error reading videos: ', error);
        res.status(500).send('Error reading videos');
    }
});


function randomCode() {
    let string = ''
    let counter = 0
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    const charLength = characters.length
    while (counter < 4) {
        string += characters.charAt(Math.floor(Math.random() * charLength));
        counter += 1;
    }
    return string
}
