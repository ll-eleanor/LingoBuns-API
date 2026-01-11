// api/profile.js
const mongoose = require('mongoose');
const Profile = require('./models/pprofile.js');

let mongoConnection = null;
const connectDB = async () => {
  if (mongoConnection) return mongoConnection;
  mongoConnection = await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://admin:bunnsabc@lingobunsapi.mnb81kt.mongodb.net/LingoBuns-API?appName=LingoBunsAPI');
  return mongoConnection;
};

module.exports = async (req, res) => {
  await connectDB();

  if (req.method === 'POST') {
    try {
      const profile = await Profile.create(req.body);
      return res.status(200).json(profile);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  if (req.method === 'GET') {
    try {
      const profiles = await Profile.find({});
      return res.status(200).json(profiles);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  if (req.method === 'PUT') {
    try {
      const { id } = req.query;
      const profile = await Profile.findByIdAndUpdate(id, req.body, { new: true });
      if (!profile) return res.status(404).json({ message: 'cannot find profile' });
      return res.status(200).json(profile);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  res.status(405).json({ message: 'Method not allowed' });
};