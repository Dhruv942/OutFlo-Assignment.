import { Request, Response } from 'express';
import { Campaign } from '../models/campaignModel';  
import { Document } from 'mongoose';


interface CampaignDocument extends Document {
  name: string;
  description?: string | null;
  status: string;
  leads: string[];
  accountIDs: string[];
}

export const getAllCampaigns = async (req: Request, res: Response): Promise<void> => {
  try {
    const campaigns = await Campaign.find({ status: { $ne: 'deleted' } });
    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching campaigns', error });
  }
};

export const getCampaignById = async (req: Request, res: Response): Promise<void> => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      res.status(404).json({ message: 'Campaign not found' });
      return;
    }

    res.json(campaign);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching campaign', error });
  }
};

export const createCampaign = async (req: Request, res: Response): Promise<void> => {
  try {
    const newCampaign: CampaignDocument = await Campaign.create(req.body);
    res.status(201).json(newCampaign);
  } catch (error) {
    res.status(500).json({ message: 'Error creating campaign', error });
  }
};

export const updateCampaign = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, status, leads, accountIDs } = req.body;

    if (!name || !status) {
      res.status(400).json({ message: 'Missing required fields: name or status' });
      return;
    }

    const updatedCampaign = await Campaign.findByIdAndUpdate(
      req.params.id, 
      { name, description, status, leads, accountIDs }, 
      { new: true }
    );

    if (!updatedCampaign) {
      res.status(404).json({ message: 'Campaign not found' });
    }

    res.json(updatedCampaign);
  } catch (error) {
    res.status(500).json({ message: 'Error updating campaign', error });
  }
};


export const deleteCampaign = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id;
    console.log("Attempting to delete campaign with ID:", id);

    const deletedCampaign = await Campaign.findByIdAndUpdate(
      id,
      { status: 'deleted' },
      { new: true }
    );

    if (!deletedCampaign) {
      res.status(404).json({ message: 'Campaign not found' });
      return;
    }

    res.json({ message: 'Campaign marked as deleted', campaign: deletedCampaign });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: 'Error deleting campaign', error });
  }
};
