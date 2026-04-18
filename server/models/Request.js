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

module.exports = mongoose.model('Request', requestSchema);
