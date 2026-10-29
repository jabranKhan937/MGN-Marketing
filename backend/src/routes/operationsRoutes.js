const express = require('express');
const router = express.Router();
const Deal = require('../models/Deal');
const Agent = require('../models/Agent');
const Campaign = require('../models/Campaign');
const Viewing = require('../models/Viewing');
const Property = require('../models/Property');
const Lead = require('../models/Lead');

// ==================== EXECUTIVE ANALYTICS OVERVIEW ====================
router.get('/overview', async (req, res) => {
  try {
    const [properties, leads, deals, agents, campaigns, viewings] = await Promise.all([
      Property.find(),
      Lead.find(),
      Deal.find().sort({ createdAt: -1 }),
      Agent.find().sort({ totalSalesVolumeAED: -1 }),
      Campaign.find().sort({ createdAt: -1 }),
      Viewing.find().sort({ scheduledDate: 1 }),
    ]);

    const totalPortfolioValueAED = properties.reduce((sum, p) => sum + (p.priceAED || 0), 0);
    const totalSalesClosedAED = deals.reduce((sum, d) => sum + (d.saleValueAED || 0), 0);
    const totalGrossCommissionAED = deals.reduce((sum, d) => sum + (d.grossCommissionAED || 0), 0);
    const totalMgnNetRevenueAED = deals.reduce((sum, d) => sum + (d.mgnNetRevenueAED || 0), 0);
    const totalPipelineBudgetAED = leads
      .filter((l) => l.stage !== 'Lost')
      .reduce((sum, l) => sum + (l.budgetAED || 0), 0);
    const totalMarketingSpendAED = campaigns.reduce((sum, c) => sum + (c.spendAED || 0), 0);
    const totalMarketingRevenueAED = campaigns.reduce((sum, c) => sum + (c.revenueAttributedAED || 0), 0);

    // Community breakdown
    const communityMap = {};
    properties.forEach((p) => {
      if (!communityMap[p.community]) {
        communityMap[p.community] = { community: p.community, count: 0, totalValueAED: 0, avgRoi: 0 };
      }
      communityMap[p.community].count += 1;
      communityMap[p.community].totalValueAED += p.priceAED;
      communityMap[p.community].avgRoi += p.roiEstimate || 8;
    });

    const communityBreakdown = Object.values(communityMap).map((item) => ({
      ...item,
      avgRoi: Number((item.avgRoi / item.count).toFixed(1)),
    }));

    // Lead stage breakdown
    const stageCounts = {
      'New Inquiry': 0,
      Contacted: 0,
      'Viewing Scheduled': 0,
      Negotiation: 0,
      'SPA Signed / Closed': 0,
      Lost: 0,
    };
    leads.forEach((l) => {
      if (stageCounts[l.stage] !== undefined) stageCounts[l.stage] += 1;
    });

    res.json({
      success: true,
      data: {
        kpis: {
          totalProperties: properties.length,
          availableProperties: properties.filter((p) => p.status === 'Available').length,
          totalPortfolioValueAED,
          totalLeads: leads.length,
          vipLeadsCount: leads.filter((l) => l.priority === 'VIP / High').length,
          totalPipelineBudgetAED,
          totalDeals: deals.length,
          totalSalesClosedAED,
          totalGrossCommissionAED,
          totalMgnNetRevenueAED,
          totalAgents: agents.length,
          activeCampaigns: campaigns.filter((c) => c.status === 'Active').length,
          totalMarketingSpendAED,
          totalMarketingRevenueAED,
          marketingRoas: totalMarketingSpendAED > 0 ? Number((totalMarketingRevenueAED / totalMarketingSpendAED).toFixed(1)) : 0,
          upcomingViewings: viewings.filter((v) => v.status === 'Confirmed').length,
        },
        communityBreakdown,
        stageCounts,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==================== DEALS & COMMISSIONS ====================
router.get('/deals', async (req, res) => {
  try {
    const deals = await Deal.find().sort({ createdAt: -1 });
    res.json({ success: true, data: deals });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/deals', async (req, res) => {
  try {
    const count = await Deal.countDocuments();
    const saleValueAED = Number(req.body.saleValueAED) || 0;
    const commissionPercent = Number(req.body.commissionPercent) || 4;
    const agentSplitPercent = Number(req.body.agentSplitPercent) || 50;
    const grossCommissionAED = (saleValueAED * commissionPercent) / 100;
    const mgnNetRevenueAED = (grossCommissionAED * (100 - agentSplitPercent)) / 100;

    const deal = await Deal.create({
      ...req.body,
      dealCode: req.body.dealCode || `MGN-DEAL-${8800 + count + 1}`,
      saleValueAED,
      commissionPercent,
      agentSplitPercent,
      grossCommissionAED,
      mgnNetRevenueAED,
    });
    res.status(201).json({ success: true, data: deal });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.put('/deals/:id', async (req, res) => {
  try {
    const deal = await Deal.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: deal });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.delete('/deals/:id', async (req, res) => {
  try {
    await Deal.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Deal deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==================== AGENTS / RERA BROKERS ====================
router.get('/agents', async (req, res) => {
  try {
    const agents = await Agent.find().sort({ totalSalesVolumeAED: -1 });
    res.json({ success: true, data: agents });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/agents', async (req, res) => {
  try {
    const agent = await Agent.create(req.body);
    res.status(201).json({ success: true, data: agent });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.put('/agents/:id', async (req, res) => {
  try {
    const agent = await Agent.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: agent });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.delete('/agents/:id', async (req, res) => {
  try {
    await Agent.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Agent removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==================== MARKETING CAMPAIGNS ====================
router.get('/campaigns', async (req, res) => {
  try {
    const campaigns = await Campaign.find().sort({ createdAt: -1 });
    res.json({ success: true, data: campaigns });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/campaigns', async (req, res) => {
  try {
    const campaign = await Campaign.create(req.body);
    res.status(201).json({ success: true, data: campaign });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.put('/campaigns/:id', async (req, res) => {
  try {
    const campaign = await Campaign.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: campaign });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.delete('/campaigns/:id', async (req, res) => {
  try {
    await Campaign.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Campaign deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==================== VIP VIEWINGS ====================
router.get('/viewings', async (req, res) => {
  try {
    const viewings = await Viewing.find().sort({ scheduledDate: 1 });
    res.json({ success: true, data: viewings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/viewings', async (req, res) => {
  try {
    const viewing = await Viewing.create(req.body);
    res.status(201).json({ success: true, data: viewing });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.put('/viewings/:id', async (req, res) => {
  try {
    const viewing = await Viewing.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: viewing });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.delete('/viewings/:id', async (req, res) => {
  try {
    await Viewing.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Viewing removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
