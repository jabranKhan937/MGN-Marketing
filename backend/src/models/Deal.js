const mongoose = require('mongoose');

const dealSchema = new mongoose.Schema(
  {
    dealCode: {
      type: String,
      required: true,
      unique: true,
    },
    propertyTitle: {
      type: String,
      required: true,
    },
    community: {
      type: String,
      required: true,
    },
    developer: {
      type: String,
      required: true,
    },
    buyerName: {
      type: String,
      required: true,
    },
    buyerNationality: {
      type: String,
      default: 'UAE',
    },
    agentName: {
      type: String,
      required: true,
    },
    dealType: {
      type: String,
      default: 'Off-Plan Sale',
    },
    saleValueAED: {
      type: Number,
      required: true,
    },
    commissionPercent: {
      type: Number,
      default: 4,
    },
    grossCommissionAED: {
      type: Number,
      required: true,
    },
    agentSplitPercent: {
      type: Number,
      default: 50,
    },
    mgnNetRevenueAED: {
      type: Number,
      required: true,
    },
    dldFeeStatus: {
      type: String,
      default: 'Paid (4%)',
    },
    status: {
      type: String,
      default: 'MOU / SPA Signed',
    },
    closingDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Deal', dealSchema);
