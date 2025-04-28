import { Router } from 'express';
import { generateLinkedInMessage } from '../controlles/messageController';
import LinkedInMessage from '../models/LinkedInMessage'; 

const router = Router();

// POST: Generate and store a personalized LinkedIn message
router.post('/personalized-message', generateLinkedInMessage);


//  GET: Fetch all stored LinkedIn messages
router.get('/messages', async (req, res) => {
  try {
    const messages = await LinkedInMessage.find(); // Use correct model
    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
