const mongoose = require('mongoose');

const viewingSchema = new mongoose.Schema(
  {
    clientName: {
      type: String,
      required: true,
    },
    clientPhone: {
      type: String,
      required: true,
    },
    clientEmail: {
      type: String,
      default: '',
    },
    propertyTitle: {
      type: String,
      required: true,
    },
    community: {
      type: String,
      required: true,
    },
    agentName: {
      type: String,
      required: true,
    },
    viewingType: {
      type: String,
      default: 'Private Chauffeur Viewing',
    },
    scheduledDate: {
      type: String,
      required: true,
    },
    scheduledTime: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: 'Confirmed',
    },
    notes: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Viewing', viewingSchema);
