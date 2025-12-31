import Campaign from '../models/Campaign.js';
import Donation from '../models/Donation.js';

export const createCampaign = async (req, res) => {
  try {
    const { title, description, goal, deadline } = req.body;

    if (!title || !description || !goal || !deadline) {
      return res.status(400).json({ message: 'Please provide all fields' });
    }

    const campaign = await Campaign.create({
      title,
      description,
      goal,
      deadline,
      createdBy: req.user._id
    });

    res.status(201).json(campaign);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find({ isActive: true })
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    // Calculate amount raised for each campaign
    const campaignsWithAmount = await Promise.all(
      campaigns.map(async (campaign) => {
        const donations = await Donation.find({
          campaign: campaign._id,
          status: 'Verified'
        });
        const amountRaised = donations.reduce((sum, donation) => sum + donation.amount, 0);
        return {
          ...campaign.toObject(),
          amountRaised
        };
      })
    );

    res.json(campaignsWithAmount);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCampaignById = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id)
      .populate('createdBy', 'name email');

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    const donations = await Donation.find({
      campaign: campaign._id,
      status: 'Verified'
    });
    const amountRaised = donations.reduce((sum, donation) => sum + donation.amount, 0);

    res.json({
      ...campaign.toObject(),
      amountRaised
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCampaign = async (req, res) => {
  try {
    const { title, description, goal, deadline, isActive } = req.body;

    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    if (campaign.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this campaign' });
    }

    campaign.title = title || campaign.title;
    campaign.description = description || campaign.description;
    campaign.goal = goal || campaign.goal;
    campaign.deadline = deadline || campaign.deadline;
    if (isActive !== undefined) campaign.isActive = isActive;

    await campaign.save();
    res.json(campaign);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    if (campaign.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this campaign' });
    }

    await Campaign.findByIdAndDelete(req.params.id);
    res.json({ message: 'Campaign deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

