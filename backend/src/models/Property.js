const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema(
  {
    referenceCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subtitle: {
      type: String,
      default: '',
    },
    description: {
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
      default: 'Emaar Properties',
    },
    propertyType: {
      type: String,
      required: true,
    },
    listingType: {
      type: String,
      required: true,
      default: 'Off-Plan',
    },
    status: {
      type: String,
      default: 'Available',
    },
    priceAED: {
      type: Number,
      required: true,
    },
    bedrooms: {
      type: Number,
      required: true,
    },
    bathrooms: {
      type: Number,
      required: true,
    },
    areaSqFt: {
      type: Number,
      required: true,
    },
    roiEstimate: {
      type: Number,
      default: 7.8,
    },
    rentalYieldPercent: {
      type: Number,
      default: 6.5,
    },
    completionYear: {
      type: String,
      default: 'Q4 2026',
    },
    paymentPlan: {
      downPayment: { type: Number, default: 20 },
      duringConstruction: { type: Number, default: 40 },
      onHandover: { type: Number, default: 40 },
      postHandover: { type: Number, default: 0 },
      summary: { type: String, default: '60/40 Flexible Payment Plan' },
    },
    goldenVisaEligible: {
      type: Boolean,
      default: true,
    },
    dldPermitNumber: {
      type: String,
      default: 'DLD-712948102',
    },
    featured: {
      type: Boolean,
      default: false,
    },
    exclusiveMGN: {
      type: Boolean,
      default: true,
    },
    amenities: [String],
    images: [String],
    coordinates: {
      lat: { type: Number, default: 25.1972 },
      lng: { type: Number, default: 55.2744 },
    },
    assignedAgentName: {
      type: String,
      default: 'Gul Nawaz',
    },
    assignedAgentPhone: {
      type: String,
      default: '+971 50 842 9910',
    },
    viewsCount: {
      type: Number,
      default: 140,
    },
    inquiriesCount: {
      type: Number,
      default: 12,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Property', propertySchema);
