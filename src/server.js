const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const socketIo = require('socket.io');

const app = express();
const port = 3333;

app.use(express.json());
app.use(cors());

const videosPath = path.join(__dirname, '../videos');

app.use('/videos', express.static(videosPath));


const io = socketIo(app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
}), {
    cors: {
        origin: 'http://localhost:4200',
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type'],
        credentials: true
    }
});

let generatedCode = '';

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('message', (selectedVideo) => {
        console.log(`Received message from client (${socket.id}):`, selectedVideo);

        generatedCode = randomCode();
        console.log('Generated code:', generatedCode);

        io.emit('generatedCode', generatedCode);
    });

    socket.on('validateCode', (userCode) => {
        let isValid = false;

        if (userCode === generatedCode) {
            console.log('Code is valid');
            isValid = true;
        } else {
            console.log('Invalid code');
        }
        io.emit('codeValidationResult', { valid: isValid });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
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



app.get('/video/getvideo', async(req, res) => {

    let video = req.body.video
    res.json("s'ha enviat el video, en verdah no")

})

function randomCode() {
    let string = ''
    let counter = 0
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    const charLength = characters.length
    while (counter < 8) {
        string += characters.charAt(Math.floor(Math.random() * charLength));
        counter += 1;
    }
    return string
}
