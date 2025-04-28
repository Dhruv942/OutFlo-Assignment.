import { Router } from 'express';
import * as campaignController from '../controlles/campaignController'; 

const router = Router();

// Route to get all campaigns
router.get('/', campaignController.getAllCampaigns);

// Route to get a specific campaign by ID
router.get('/:id', campaignController.getCampaignById);

// Route to create a new campaign
router.post('/', campaignController.createCampaign);

// Route to update an existing campaign by ID
router.put('/:id', campaignController.updateCampaign);

// Route to soft delete a campaign by ID
router.delete('/:id/delete', campaignController.deleteCampaign);

export default router;
