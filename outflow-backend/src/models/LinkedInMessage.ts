import mongoose, { Schema, Document } from 'mongoose';

interface ILinkedInMessage extends Document {
  name: string;
  job_title: string;
  company: string;
  location: string;
  summary: string;
  message: string;
  created_at: Date;
}

const LinkedInMessageSchema: Schema = new Schema({
  name: { type: String, required: true },
  job_title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  summary: { type: String, required: true },
  message: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

const LinkedInMessage = mongoose.model<ILinkedInMessage>('LinkedInMessage', LinkedInMessageSchema);

export default LinkedInMessage;
