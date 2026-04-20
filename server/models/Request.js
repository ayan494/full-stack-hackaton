const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  urgency: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
  status: { type: String, enum: ['Open', 'Solved'], default: 'Open' },
  tags: [{ type: String }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  helpersInterested: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  aiSummary: { type: String },
}, {
  timestamps: true
});

// Indexes for query performance
requestSchema.index({ status: 1, createdAt: -1 });
requestSchema.index({ category: 1 });
requestSchema.index({ createdBy: 1 });
requestSchema.index({ urgency: 1 });

module.exports = mongoose.model('Request', requestSchema);
