const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true, trim: true },
  email: { type: String, default: '', trim: true },
  phone: { type: String, default: '', trim: true },
  company: { type: String, default: '', trim: true },
  solution: { type: String, default: 'General Inquiry', trim: true },
  message: { type: String, default: '' },
  selectionMode: { type: String, default: 'products' },
  selectedProducts: [{
    id: String,
    name: String,
    code: String,
    qty: Number
  }],
  selectedAreas: [{ type: String }],
  cameraCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

module.exports = mongoose.models.Inquiry || mongoose.model('Inquiry', inquirySchema);

