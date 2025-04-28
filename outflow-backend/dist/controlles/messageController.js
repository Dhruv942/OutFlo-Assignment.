"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateLinkedInMessage = void 0;
const generative_ai_1 = require("@google/generative-ai");
const LinkedInMessage_1 = __importDefault(require("../models/LinkedInMessage"));
const genAI = new generative_ai_1.GoogleGenerativeAI('AIzaSyCKsmM6T24MMsFeroxBMWp-pPunlHnhYVI');
const generateLinkedInMessage = async (req, res) => {
    try {
        const { name, job_title, company, location, summary } = req.body;
        if (!name || !job_title || !company || !location || !summary) {
            res.status(400).json({ message: 'All fields are required' });
            return;
        }
        const prompt = `
      Write a personalized LinkedIn outreach message for the following person:
      - Name: ${name}
      - Job Title: ${job_title}
      - Company: ${company}
      - Location: ${location}
      - Summary: ${summary}

      Make the tone friendly, professional, and engaging.
    `;
        // Gemini 1.5 Flash call
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const message = response.text().trim();
        if (!message) {
            res.status(500).json({ message: 'No message generated from Gemini' });
            return;
        }
        // Save to MongoDB
        const newMessage = await LinkedInMessage_1.default.create({
            name,
            job_title,
            company,
            location,
            summary,
            message,
        });
        res.status(200).json({ message: newMessage.message, id: newMessage._id });
    }
    catch (error) {
        console.error('Error generating LinkedIn message:', error.message || error);
        res.status(500).json({ message: 'Error generating message', error: error.message || error });
    }
};
exports.generateLinkedInMessage = generateLinkedInMessage;
