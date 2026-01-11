const express = require('express')();
const app = express();

app.use(express.json())

app.get('/client', (req, res) => {
    res.status(200).send({
        clientName: 'Janet',
        clientAge: '6'
    })
});