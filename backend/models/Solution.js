const mongoose = require('mongoose');

const solutionSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  title: { type: String, required: true, trim: true },
  category: { type: String, default: 'Enterprise Security', trim: true },
  description: { type: String, default: '', trim: true },
  image: { type: String, default: '' },
  features: [{ type: String }]
}, {
  timestamps: true
});

module.exports = mongoose.models.Solution || mongoose.model('Solution', solutionSchema);
