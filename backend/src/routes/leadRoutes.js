const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');
const Property = require('../models/Property');

// GET all leads
router.get('/', async (req, res) => {
  try {
    const { stage, priority, assignedAgent, search } = req.query;
    const filter = {};
    if (stage && stage !== 'All') filter.stage = stage;
    if (priority && priority !== 'All') filter.priority = priority;
    if (assignedAgent && assignedAgent !== 'All') filter.assignedAgent = assignedAgent;
    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { interestedCommunity: { $regex: search, $options: 'i' } },
        { nationality: { $regex: search, $options: 'i' } },
      ];
    }

    const leads = await Lead.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: leads.length, data: leads });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST create lead (both from public website inquiry form and CRM)
router.post('/', async (req, res) => {
  try {
    const lead = await Lead.create(req.body);
    if (req.body.interestedPropertyId) {
      await Property.findByIdAndUpdate(req.body.interestedPropertyId, {
        $inc: { inquiriesCount: 1 },
      });
    }
    res.status(201).json({ success: true, data: lead });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// PUT update lead (stage, agent, notes, priority)
router.put('/:id', async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { ...req.body, lastContactedAt: Date.now() },
      { new: true, runValidators: true }
    );
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }
    res.json({ success: true, data: lead });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE lead
router.delete('/:id', async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }
    res.json({ success: true, message: 'Lead deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
