const express = require('express');
const cors = require('cors');

const app = express();
const port = 42069;

app.use(express.json());
app.use(cors());

app.listen(port, () => {
    console.log(`Servidor engegat en el port : ${port}`);
});

app.get('/video/getvideo', async(req, res) => {

    let video = req.body.video
    res.json("s'ha enviat el video, en verdah no")

})