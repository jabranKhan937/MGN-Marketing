const mongoose = require('mongoose');

const agentSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      default: 'Senior Property Consultant',
    },
    reraBrn: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    whatsapp: {
      type: String,
      required: true,
    },
    specialization: {
      type: String,
      default: 'Downtown Dubai & Palm Jumeirah',
    },
    languages: [String],
    avatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80',
    },
    totalSalesVolumeAED: {
      type: Number,
      default: 45000000,
    },
    dealsClosed: {
      type: Number,
      default: 14,
    },
    activeListings: {
      type: Number,
      default: 8,
    },
    rating: {
      type: Number,
      default: 4.9,
    },
    status: {
      type: String,
      enum: ['Active', 'In Viewing', 'International Roadshow', 'On Leave'],
      default: 'Active',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Agent', agentSchema);
