require('dotenv').config();
const connectDB = require('../config/db');
const Property = require('../models/Property');
const Agent = require('../models/Agent');
const Lead = require('../models/Lead');
const Deal = require('../models/Deal');
const Campaign = require('../models/Campaign');
const Viewing = require('../models/Viewing');
const {
  initialProperties,
  initialAgents,
  initialLeads,
  initialDeals,
  initialCampaigns,
  initialViewings,
} = require('./dubaiData');

const seedDatabase = async (force = false) => {
  const [propCount, leadCount, dealCount] = await Promise.all([
    Property.countDocuments(),
    Lead.countDocuments(),
    Deal.countDocuments(),
  ]);
  if (propCount > 0 && leadCount > 0 && dealCount > 0 && !force) {
    console.log(`ℹ️ Database already populated with ${propCount} Dubai properties, ${leadCount} leads, and ${dealCount} deals.`);
    return;
  }

  console.log('🌴 Seeding MGN Marketing Dubai Luxury Real Estate Database...');
  await Promise.all([
    Property.deleteMany({}),
    Agent.deleteMany({}),
    Lead.deleteMany({}),
    Deal.deleteMany({}),
    Campaign.deleteMany({}),
    Viewing.deleteMany({}),
  ]);

  await Property.insertMany(initialProperties);
  await Agent.insertMany(initialAgents);
  await Lead.insertMany(initialLeads);
  await Deal.insertMany(initialDeals);
  await Campaign.insertMany(initialCampaigns);
  await Viewing.insertMany(initialViewings);

  console.log('✅ MGN Marketing Database Seeded Successfully!');
};

if (require.main === module) {
  connectDB().then(async () => {
    await seedDatabase(true);
    process.exit(0);
  });
}

module.exports = seedDatabase;
