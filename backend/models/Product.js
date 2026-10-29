let mongoose = null;
try {
  mongoose = require('mongoose');
} catch (e) {
  mongoose = null;
}

if (!mongoose) {
  module.exports = {};
} else {
  const productSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    model: { type: String, required: true, trim: true, index: true },
    productCode: { type: String, trim: true, index: true },
    slug: { type: String, trim: true, index: true },
    brand: { type: String, default: 'Color On', trim: true },
    category: { type: String, default: 'HD Analog Cameras', trim: true },
    categories: [{ type: String, trim: true }],
    price: { type: Number, default: 0 },
    image: { type: String, default: '/color_on_bullet_hd.png' },
    title: { type: String, trim: true },
    description: { type: String, trim: true },
    fullText: { type: String, default: '' },
    driveLink: { type: String, default: '' },
    datasheetPdf: { type: String, default: '' },
    datasheetPdfName: { type: String, default: '' },
    keyFeatures: [{ type: String }],
    specs: { type: mongoose.Schema.Types.Mixed, default: {} },
    functions: { type: mongoose.Schema.Types.Mixed, default: {} }
  }, {
    timestamps: true
  });

  module.exports = mongoose.models.Product || mongoose.model('Product', productSchema);
}
