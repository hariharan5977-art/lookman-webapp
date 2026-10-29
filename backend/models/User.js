const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  plainPasswordHint: { type: String, default: '' },
  role: { type: String, default: 'administrator' },
  company: { type: String, default: 'LOOKMAN DISTRIBUTION PRIVATE LIMITED' }
}, {
  timestamps: true
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
