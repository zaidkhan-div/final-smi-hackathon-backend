import mongoose from 'mongoose';

const campaignSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a campaign title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a campaign description'],
    trim: true
  },
  goal: {
    type: Number,
    required: [true, 'Please provide a campaign goal'],
    min: 0
  },
  deadline: {
    type: Date,
    required: [true, 'Please provide a campaign deadline']
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Virtual for current amount raised
campaignSchema.virtual('amountRaised', {
  ref: 'Donation',
  localField: '_id',
  foreignField: 'campaign',
  options: { match: { status: 'Verified' } }
});

const Campaign = mongoose.model('Campaign', campaignSchema);

export default Campaign;

