const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  reportId: {
    type: String,
    required: true,
    unique: true
  },
  vessel: {
    type: String,
    required: true
  },
  species: {
    type: String,
    required: true
  },
  coverage: {
    type: Number,
    required: true
  },
  density: {
    type: Number,
    required: false // Optional for backward compatibility
  },
  criticality: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    required: true
  },
  fuelPenalty: {
    type: Number,
    required: true
  },
  method: {
    type: String,
    required: true
  },
  urgency: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    required: true
  },
  note: {
    type: String,
    required: true
  },
  confidence: {
    type: Number,
    required: false
  },
  density_details: {
    type: Object,
    required: false
  },
  location: {
    lat: {
      type: Number,
      required: true
    },
    lng: {
      type: Number,
      required: true
    }
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  imageUrl: {
    type: String
  }
}, {
  timestamps: true
});

reportSchema.index({ "location.lat": 1, "location.lng": 1 });

module.exports = mongoose.model('Report', reportSchema);