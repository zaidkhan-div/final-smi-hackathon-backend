import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: [true, 'Please provide a donation amount'],
    min: 1
  },
  type: {
    type: String,
    enum: ['Zakat', 'Sadqah', 'Fitra', 'General'],
    required: [true, 'Please provide a donation type']
  },
  category: {
    type: String,
    enum: ['Food', 'Education', 'Medical'],
    required: [true, 'Please provide a category']
  },
  paymentMethod: {
    type: String,
    enum: ['Cash', 'Bank', 'Online'],
    required: [true, 'Please provide a payment method']
  },
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  campaign: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign',
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Verified'],
    default: 'Pending'
  }
}, {
  timestamps: true
});

const Donation = mongoose.model('Donation', donationSchema);

export default Donation;

