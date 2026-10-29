const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    nationality: {
      type: String,
      default: 'United Kingdom',
    },
    budgetAED: {
      type: Number,
      default: 3500000,
    },
    clientIntent: {
      type: String,
      default: 'Buy Property',
    },
    propertyCategory: {
      type: String,
      default: 'Apartment',
    },
    bedroomsRequirement: {
      type: String,
      default: '2 Bedrooms',
    },
    furnishingPreference: {
      type: String,
      default: 'Furnished',
    },
    moveInTimeline: {
      type: String,
      default: 'Immediate / Ready',
    },
    rentFrequency: {
      type: String,
      default: 'Annual (1 - 4 Cheques)',
    },
    titleDeedOrOqoodNumber: {
      type: String,
      default: '',
    },
    interestedCommunity: {
      type: String,
      default: 'Downtown Dubai',
    },
    interestedPropertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: false,
    },
    interestedPropertyTitle: {
      type: String,
      default: 'General Portfolio Inquiry',
    },
    purpose: {
      type: String,
      default: 'Investment / High ROI',
    },
    paymentPreference: {
      type: String,
      default: 'Developer Payment Plan',
    },
    source: {
      type: String,
      default: 'Website Direct',
    },
    stage: {
      type: String,
      default: 'New Inquiry',
    },
    priority: {
      type: String,
      default: 'VIP / High',
    },
    assignedAgent: {
      type: String,
      default: 'Gul Nawaz',
    },
    notes: {
      type: String,
      default: '',
    },
    lastContactedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Lead', leadSchema);
