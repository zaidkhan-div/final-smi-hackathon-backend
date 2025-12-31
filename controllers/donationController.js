import Donation from '../models/Donation.js';
import Campaign from '../models/Campaign.js';

export const createDonation = async (req, res) => {
  try {
    const { amount, type, category, paymentMethod, campaign } = req.body;

    if (!amount || !type || !category || !paymentMethod || !campaign) {
      return res.status(400).json({ message: 'Please provide all fields' });
    }

    const campaignExists = await Campaign.findById(campaign);
    if (!campaignExists) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    if (!campaignExists.isActive) {
      return res.status(400).json({ message: 'Campaign is not active' });
    }

    const donation = await Donation.create({
      amount,
      type,
      category,
      paymentMethod,
      donor: req.user._id,
      campaign
    });

    const populatedDonation = await Donation.findById(donation._id)
      .populate('donor', 'name email')
      .populate('campaign', 'title');

    res.status(201).json(populatedDonation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ donor: req.user._id })
      .populate('campaign', 'title description')
      .sort({ createdAt: -1 });

    const totalAmount = donations
      .filter(d => d.status === 'Verified')
      .reduce((sum, donation) => sum + donation.amount, 0);

    res.json({
      donations,
      totalAmount,
      totalCount: donations.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find()
      .populate('donor', 'name email phone')
      .populate('campaign', 'title')
      .sort({ createdAt: -1 });

    const totalAmount = donations
      .filter(d => d.status === 'Verified')
      .reduce((sum, donation) => sum + donation.amount, 0);

    res.json({
      donations,
      totalAmount,
      totalCount: donations.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateDonationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['Pending', 'Verified'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    donation.status = status;
    await donation.save();

    const populatedDonation = await Donation.findById(donation._id)
      .populate('donor', 'name email phone')
      .populate('campaign', 'title');

    res.json(populatedDonation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDonationById = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id)
      .populate('donor', 'name email phone')
      .populate('campaign', 'title description');

    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    // Check if user is the donor or admin
    if (donation.donor._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this donation' });
    }

    res.json(donation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

