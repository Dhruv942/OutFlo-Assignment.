import { Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import LinkedInMessage from '../models/LinkedInMessage';

const genAI = new GoogleGenerativeAI('AIzaSyCKsmM6T24MMsFeroxBMWp-pPunlHnhYVI');

export const generateLinkedInMessage = async (req: Request, res: Response): Promise<void> => {
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
    const newMessage = await LinkedInMessage.create({
      name,
      job_title,
      company,
      location,
      summary,
      message,
    });

    res.status(200).json({ message: newMessage.message, id: newMessage._id });
  } catch (error: any) {
    console.error('Error generating LinkedIn message:', error.message || error);
    res.status(500).json({ message: 'Error generating message', error: error.message || error });
  }
};
