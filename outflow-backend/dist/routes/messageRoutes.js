"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const messageController_1 = require("../controlles/messageController");
const LinkedInMessage_1 = __importDefault(require("../models/LinkedInMessage"));
const router = (0, express_1.Router)();
// POST: Generate and store a personalized LinkedIn message
router.post('/personalized-message', messageController_1.generateLinkedInMessage);
//  GET: Fetch all stored LinkedIn messages
router.get('/messages', async (req, res) => {
    try {
        const messages = await LinkedInMessage_1.default.find(); // Use correct model
        res.json(messages);
    }
    catch (error) {
        console.error("Error fetching messages", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.default = router;
