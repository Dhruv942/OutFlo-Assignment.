import { Schema, model } from 'mongoose';

const campaignSchema = new Schema({
  name: { type: String, required: true },
  description: String,
  status: { type: String, enum: ['active', 'inactive', 'deleted'], default: 'inactive' },
  leads: [String],
  accountIDs: [String],
}, { timestamps: true });

export const Campaign = model('Campaign', campaignSchema);
