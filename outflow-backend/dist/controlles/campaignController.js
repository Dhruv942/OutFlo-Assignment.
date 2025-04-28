"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCampaign = exports.updateCampaign = exports.createCampaign = exports.getCampaignById = exports.getAllCampaigns = void 0;
const campaignModel_1 = require("../models/campaignModel");
const getAllCampaigns = async (req, res) => {
    try {
        const campaigns = await campaignModel_1.Campaign.find({ status: { $ne: 'deleted' } });
        res.json(campaigns);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching campaigns', error });
    }
};
exports.getAllCampaigns = getAllCampaigns;
const getCampaignById = async (req, res) => {
    try {
        const campaign = await campaignModel_1.Campaign.findById(req.params.id);
        if (!campaign) {
            res.status(404).json({ message: 'Campaign not found' });
            return;
        }
        res.json(campaign);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching campaign', error });
    }
};
exports.getCampaignById = getCampaignById;
const createCampaign = async (req, res) => {
    try {
        const newCampaign = await campaignModel_1.Campaign.create(req.body);
        res.status(201).json(newCampaign);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating campaign', error });
    }
};
exports.createCampaign = createCampaign;
const updateCampaign = async (req, res) => {
    try {
        const { name, description, status, leads, accountIDs } = req.body;
        if (!name || !status) {
            res.status(400).json({ message: 'Missing required fields: name or status' });
            return;
        }
        const updatedCampaign = await campaignModel_1.Campaign.findByIdAndUpdate(req.params.id, { name, description, status, leads, accountIDs }, { new: true });
        if (!updatedCampaign) {
            res.status(404).json({ message: 'Campaign not found' });
        }
        res.json(updatedCampaign);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating campaign', error });
    }
};
exports.updateCampaign = updateCampaign;
const deleteCampaign = async (req, res) => {
    try {
        const id = req.params.id;
        console.log("Attempting to delete campaign with ID:", id);
        const deletedCampaign = await campaignModel_1.Campaign.findByIdAndUpdate(id, { status: 'deleted' }, { new: true });
        if (!deletedCampaign) {
            res.status(404).json({ message: 'Campaign not found' });
            return;
        }
        res.json({ message: 'Campaign marked as deleted', campaign: deletedCampaign });
    }
    catch (error) {
        console.error("Delete error:", error);
        res.status(500).json({ message: 'Error deleting campaign', error });
    }
};
exports.deleteCampaign = deleteCampaign;
