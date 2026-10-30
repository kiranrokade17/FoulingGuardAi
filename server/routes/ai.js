const express = require('express');
const axios = require('axios');
const router = express.Router();

// AI Model Service Configuration
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:5001';

// Health check for AI service
router.get('/health', async (req, res) => {
  console.log('🔍 Checking AI service health...');
  
  try {
    const response = await axios.get(`${AI_SERVICE_URL}/health`, { timeout: 5000 });
    console.log('✅ AI service is healthy');
    res.json({
      ai_service: 'healthy',
      ...response.data
    });
  } catch (error) {
    console.error('❌ AI service health check failed:', error.message);
    res.status(503).json({
      ai_service: 'unhealthy',
      error: error.message
    });
  }
});

// Analyze image and create report
router.post('/analyze', async (req, res) => {
  console.log('🤖 AI analysis request received');
  
  try {
    const { image, location, vessel = 'MV Ocean Explorer' } = req.body;
    
    if (!image) {
      return res.status(400).json({ error: 'Image data required' });
    }
    
    if (!location || !location.lat || !location.lng) {
      return res.status(400).json({ error: 'Location coordinates required' });
    }
    
    // Call AI model service
    console.log('📡 Sending image to AI model...');
    const aiResponse = await axios.post(`${AI_SERVICE_URL}/predict`, 
      { image }, 
      { 
        timeout: 30000,
        headers: { 'Content-Type': 'application/json' }
      }
    );
    
    if (!aiResponse.data.success) {
      throw new Error('AI analysis failed');
    }
    
    const analysis = aiResponse.data.analysis;
    console.log('✅ AI analysis complete:', analysis.species, (analysis.density || analysis.coverage) + '% density');
    
    // Create report data
    const reportData = {
      reportId: `RPT-${Date.now()}`,
      vessel: vessel,
      species: analysis.species,
      coverage: analysis.coverage || analysis.density, // Backward compatibility
      density: analysis.density || analysis.coverage,   // New density field
      criticality: analysis.criticality,
      fuelPenalty: analysis.fuelPenalty,
      method: analysis.method,
      urgency: analysis.urgency,
      note: analysis.note,
      confidence: analysis.confidence,
      density_details: analysis.density_details, // Include Otsu details if available
      location: location,
      imageUrl: typeof image === 'string' && image.startsWith('http') ? image : null,
      timestamp: new Date().toISOString()
    };
    
    // Save to database
    const Report = require('../models/Report');
    const report = new Report(reportData);
    const savedReport = await report.save();
    
    console.log('💾 Report saved to database:', savedReport._id);
    
    // Return complete analysis
    res.status(201).json({
      success: true,
      report: savedReport,
      analysis: analysis
    });
    
  } catch (error) {
    console.error('❌ AI analysis error:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({ 
        error: 'AI service unavailable',
        details: 'Model service is not running'
      });
    }
    
    res.status(500).json({ 
      error: 'Analysis failed',
      details: error.message 
    });
  }
});

// Calculate density using Otsu thresholding
router.post('/calculate-density', async (req, res) => {
  console.log('📊 Density calculation request received');
  
  try {
    const { image } = req.body;
    
    if (!image) {
      return res.status(400).json({ error: 'Image data required' });
    }
    
    // Call AI model service for density calculation
    console.log('📡 Sending image to AI model for density calculation...');
    const densityResponse = await axios.post(`${AI_SERVICE_URL}/calculate-density`, 
      { image }, 
      { 
        timeout: 30000,
        headers: { 'Content-Type': 'application/json' }
      }
    );
    
    if (!densityResponse.data.success) {
      throw new Error(densityResponse.data.error || 'Density calculation failed');
    }
    
    const densityAnalysis = densityResponse.data.density_analysis;
    console.log('✅ Density calculation complete:', densityAnalysis.density_percentage + '%', 'Severity:', densityAnalysis.severity);
    
    // Return density analysis
    res.status(200).json({
      success: true,
      density_analysis: densityAnalysis,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Density calculation error:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({ 
        error: 'AI service unavailable',
        details: 'Model service is not running'
      });
    }
    
    res.status(500).json({ 
      error: 'Density calculation failed',
      details: error.message 
    });
  }
});

module.exports = router;