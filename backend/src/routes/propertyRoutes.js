const express = require('express');
const router = express.Router();
const Property = require('../models/Property');

// GET all properties with filtering
router.get('/', async (req, res) => {
  try {
    const { community, propertyType, listingType, minPrice, maxPrice, bedrooms, search, featured } = req.query;
    const filter = {};

    if (community && community !== 'All') filter.community = community;
    if (propertyType && propertyType !== 'All') filter.propertyType = propertyType;
    if (listingType && listingType !== 'All') filter.listingType = listingType;
    if (featured === 'true') filter.featured = true;
    if (bedrooms && bedrooms !== 'All') {
      filter.bedrooms = { $gte: Number(bedrooms) };
    }
    if (minPrice || maxPrice) {
      filter.priceAED = {};
      if (minPrice) filter.priceAED.$gte = Number(minPrice);
      if (maxPrice) filter.priceAED.$lte = Number(maxPrice);
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { community: { $regex: search, $options: 'i' } },
        { developer: { $regex: search, $options: 'i' } },
        { referenceCode: { $regex: search, $options: 'i' } },
      ];
    }

    const properties = await Property.find(filter).sort({ featured: -1, createdAt: -1 });
    res.json({ success: true, count: properties.length, data: properties });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET single property
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { $inc: { viewsCount: 1 } },
      { new: true }
    );
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }
    res.json({ success: true, data: property });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST create property
router.post('/', async (req, res) => {
  try {
    const count = await Property.countDocuments();
    const referenceCode = req.body.referenceCode || `MGN-DXB-${100 + count + 1}`;
    const property = await Property.create({
      ...req.body,
      referenceCode,
    });
    res.status(201).json({ success: true, data: property });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// PUT update property
router.put('/:id', async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }
    res.json({ success: true, data: property });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE property
router.delete('/:id', async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }
    res.json({ success: true, message: 'Property removed from portfolio' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
