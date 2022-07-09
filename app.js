const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 3005;
const fs = require('fs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('assets'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/template/index.html');
});

app.listen(port, () => {
    console.log(`[Flag Creator] listening at http://localhost:${port}`);
});