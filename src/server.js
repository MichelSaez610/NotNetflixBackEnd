const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3333;

app.use(express.json());
app.use(cors());

app.listen(port, () => {
    console.log(`Server is running in port: ${port}`);
});

app.get('/video/getAllVideos', async(req,res) => {
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
    }
})


app.get('/video/getvideo', async(req, res) => {

    let video = req.body.video
    res.json("s'ha enviat el video, en verdah no")

})