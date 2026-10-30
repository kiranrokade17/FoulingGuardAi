const express = require('express');
const Report = require('../models/Report');
const router = express.Router();

// GET endpoint for testing
router.get('/', async (req, res) => {
  console.log('📋 GET /api/reports - fetching all reports');
  try {
    const reports = await Report.find().sort({ timestamp: -1 }).limit(10);
    console.log(`✅ Found ${reports.length} reports`);
    res.json(reports);
  } catch (error) {
    console.error('❌ Error fetching reports:', error);
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});

// Create new report
router.post('/', async (req, res) => {
  console.log('📄 Creating new report...');
  console.log('Request body keys:', Object.keys(req.body));
  
  try {
    // Validate required fields
    const { reportId, vessel, species, coverage, criticality, location } = req.body;
    if (!reportId || !vessel || !species || coverage === undefined || !criticality || !location) {
      console.log('❌ Missing required fields');
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    if (!location.lat || !location.lng) {
      console.log('❌ Missing location coordinates');
      return res.status(400).json({ error: 'Location coordinates required' });
    }
    
    const report = new Report(req.body);
    console.log('Report object created for:', reportId);
    
    const savedReport = await report.save();
    console.log('✅ Report saved successfully:', savedReport._id);
    
    res.status(201).json({ success: true, id: savedReport._id });
  } catch (error) {
    console.error('❌ Error saving report:', error.message);
    if (error.name === 'ValidationError') {
      res.status(400).json({ error: 'Validation failed', details: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// Get all reports for map
router.get('/map', async (req, res) => {
  try {
    const reports = await Report.find({}, {
      reportId: 1,
      species: 1,
      criticality: 1,
      location: 1,
      timestamp: 1,
      vessel: 1
    }).sort({ timestamp: -1 });
    
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get hotspots (aggregated data)
router.get('/hotspots', async (req, res) => {
  console.log('🗺️ Fetching hotspots...');
  
  try {
    const totalReports = await Report.countDocuments();
    console.log(`Total reports in database: ${totalReports}`);
    
    const hotspots = await Report.aggregate([
      {
        $group: {
          _id: {
            lat: { $round: ["$location.lat", 2] },
            lng: { $round: ["$location.lng", 2] }
          },
          count: { $sum: 1 },
          species: { $addToSet: "$species" },
          maxSeverity: { $max: "$criticality" },
          lastReported: { $max: "$timestamp" }
        }
      },
      {
        $project: {
          _id: 0,
          lat: "$_id.lat",
          lng: "$_id.lng",
          count: 1,
          species: 1,
          severity: "$maxSeverity",
          lastReported: 1
        }
      },
      { $sort: { count: -1 } }
    ]);
    
    console.log(`✅ Found ${hotspots.length} hotspots`);
    console.log('Hotspots:', JSON.stringify(hotspots, null, 2));
    
    res.json(hotspots);
  } catch (error) {
    console.error('❌ Error fetching hotspots:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;