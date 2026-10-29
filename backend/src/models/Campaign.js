const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema(
  {
    campaignName: {
      type: String,
      required: true,
    },
    channel: {
      type: String,
      required: true,
    },
    targetCommunity: {
      type: String,
      default: 'Palm Jumeirah & Downtown',
    },
    targetAudience: {
      type: String,
      default: 'UK, Europe & GCC Investors',
    },
    status: {
      type: String,
      default: 'Active',
    },
    budgetAED: {
      type: Number,
      required: true,
    },
    spendAED: {
      type: Number,
      default: 0,
    },
    impressions: {
      type: Number,
      default: 0,
    },
    clicks: {
      type: Number,
      default: 0,
    },
    leadsGenerated: {
      type: Number,
      default: 0,
    },
    dealsAttributed: {
      type: Number,
      default: 0,
    },
    revenueAttributedAED: {
      type: Number,
      default: 0,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Campaign', campaignSchema);
