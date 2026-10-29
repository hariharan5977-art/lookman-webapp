let mongoose = null;
try {
  mongoose = require('mongoose');
} catch (e) {
  mongoose = null;
}

if (!mongoose) {
  module.exports = {};
} else {
  const categorySchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    subcategories: [{ type: String, trim: true }]
  }, {
    timestamps: true
  });

  module.exports = mongoose.models.Category || mongoose.model('Category', categorySchema);
}
