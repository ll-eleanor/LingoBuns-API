import mongoose from 'mongoose';
import Profile from '../models/pprofile.js';

let mongoConnection = null;

const connectDB = async () => {
  if (mongoConnection) return mongoConnection;
  
  mongoConnection = await mongoose.connect('mongodb+srv://admin:bunnsabc@lingobunsapi.mnb81kt.mongodb.net/LingoBuns-API?appName=LingoBunsAPI');
  return mongoConnection;
};

export default async function handler(req, res) {
  await connectDB();

  if (req.method === 'POST') {
    try {
      const profile = await Profile.create(req.body);
      res.status(200).json(profile);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } 
  else if (req.method === 'GET') {
    try {
      const profiles = await Profile.find({});
      res.status(200).json(profiles);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  else if (req.method === 'PUT') {
    try {
      const { id } = req.query;
      const profile = await Profile.findByIdAndUpdate(id, req.body, { new: true });
      if (!profile) {
        return res.status(404).json({ message: 'cannot find profile' });
      }
      res.status(200).json(profile);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}