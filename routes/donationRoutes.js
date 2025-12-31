import express from 'express';
import {
  createDonation,
  getMyDonations,
  getAllDonations,
  updateDonationStatus,
  getDonationById
} from '../controllers/donationController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, createDonation);
router.get('/my', protect, getMyDonations);
router.get('/', protect, admin, getAllDonations);
router.get('/:id', protect, getDonationById);
router.put('/:id/status', protect, admin, updateDonationStatus);

export default router;

