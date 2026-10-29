require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const seedDatabase = require('./seed/seedData');

const propertyRoutes = require('./routes/propertyRoutes');
const leadRoutes = require('./routes/leadRoutes');
const operationsRoutes = require('./routes/operationsRoutes');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));

// Health endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'operational',
    company: 'MGN Marketing Dubai Real Estate LLC',
    database: 'MongoDB Connected',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/properties', propertyRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/operations', operationsRoutes);

// Start server & connect MongoDB
const startServer = async () => {
  await connectDB();
  await seedDatabase(false);

  app.listen(PORT, () => {
    console.log(`🚀 MGN Marketing Backend API running on http://localhost:${PORT}`);
  });
};

startServer();
