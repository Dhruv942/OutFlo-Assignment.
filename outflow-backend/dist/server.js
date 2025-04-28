"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const campaignRoutes_1 = __importDefault(require("./routes/campaignRoutes"));
const messageRoutes_1 = __importDefault(require("./routes/messageRoutes"));
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
// Routes
app.use('/api/campaigns', campaignRoutes_1.default);
app.use('/api', messageRoutes_1.default);
// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
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
