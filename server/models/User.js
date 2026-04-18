const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Need Help', 'Can Help', 'Both'], default: 'Both' },
  location: { type: String, default: '' },
  skills: [{ type: String }],
  interests: [{ type: String }],
  badges: [{ type: String }],
  trustScore: { type: Number, default: 0 },
  contributions: { type: Number, default: 0 },
  initials: { type: String },
  color: { type: String, default: 'from-blue-500 to-indigo-500' }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
