import express = require('express');
import cors = require('cors');
import dotenv = require('dotenv');
import mongoose = require('mongoose');
import campaignRoutes from './routes/campaignRoutes';
import messageRoutes from './routes/messageRoutes';

dotenv.config();

const app = express();


app.use(cors());


app.use(express.json());

// Routes
app.use('/api/campaigns', campaignRoutes);
app.use('/api', messageRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI as string)
  .then(() => {
    console.log('MongoDB connected successfully!');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
