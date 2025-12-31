import express from 'express';
import {
  createCampaign,
  getCampaigns,
  getCampaignById,
  updateCampaign,
  deleteCampaign
} from '../controllers/campaignController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getCampaigns);
router.get('/:id', getCampaignById);
router.post('/', protect, admin, createCampaign);
router.put('/:id', protect, admin, updateCampaign);
router.delete('/:id', protect, admin, deleteCampaign);

export default router;

