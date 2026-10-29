const mongoose = require('mongoose');

const deletedItemSchema = new mongoose.Schema({
  type: { type: String, enum: ['product', 'inquiry'], required: true, index: true },
  identifier: { type: String, required: true, unique: true, index: true },
  deletedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.DeletedItem || mongoose.model('DeletedItem', deletedItemSchema);
