const express = require('express');
const mongoose = require('mongoose');
const Profile = require('./api/profile')
const app = express();

app.use(express.json())

mongoose.connect('mongodb+srv://admin:bunnsabc@lingobunsapi.mnb81kt.mongodb.net/LingoBuns-API?appName=LingoBunsAPI')
.then(()=>{
    console.log('connected to mongoose')
    app.listen(8080, console.log("connected to node")) 
}).catch((error)=>{
    console.log(error)
})

app.post('/profile', async(req, res) => {
    try {
        const profile = await Profile.create(req.body)
        res.status(200).json(profile);
    } catch(error) {
        console.log(error.message);
        res.status(500).json({message: error.message})
    }
})

app.get('/profile', async(req, res) => {
    try {
        const profile = await Profile.find({})
        res.status(200).json(profile);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
});

app.put('/profile/:id', async(req, res) => {
    try {
        const {id} = req.params;
        const profile = await Profile.findByIdAndUpdate(id, req.body)
        if(!profile){
            return res.status(404).json({message: `cannot find profile`})
        }
        res.status(200).json(profile);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})