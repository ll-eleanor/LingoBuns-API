const express = require('express');
const mongoose = require('mongoose');
const Profile = require('./api/profile');
const app = express();

app.use(express.json())

let mongoConnection = null;

const connectDB = async () => {
  if (mongoConnection) return mongoConnection;
  
  mongoConnection = await mongoose.connect('mongodb+srv://admin:bunnsabc@lingobunsapi.mnb81kt.mongodb.net/LingoBuns-API?appName=LingoBunsAPI');
  return mongoConnection;
};

app.post('/profile', async(req, res) => {
    try {
        await connectDB();
        const profile = await Profile.create(req.body)
        res.status(200).json(profile);
    } catch(error) {
        console.log(error.message);
        res.status(500).json({message: error.message})
    }
})

app.get('/profile', async(req, res) => {
    try {
        await connectDB();
        const profile = await Profile.find({})
        res.status(200).json(profile);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
});

app.put('/profile/:id', async(req, res) => {
    try {
        await connectDB();
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

// For local development
if (process.env.NODE_ENV !== 'production') {
  mongoose.connect('mongodb+srv://admin:bunnsabc@lingobunsapi.mnb81kt.mongodb.net/LingoBuns-API?appName=LingoBunsAPI')
    .then(() => {
      console.log('connected to mongoose')
      app.listen(3000) 
    }).catch((error) => {
      console.log(error)
    })
}

// Export for Vercel
module.exports = app;