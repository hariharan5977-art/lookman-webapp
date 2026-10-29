const express = require('express');
const fs = require('fs');
const path = require('path');
const Product = require('../models/Product');
const Category = require('../models/Category');
const DeletedItem = require('../models/DeletedItem');
const { isMongoConnected } = require('../config/db');

const router = express.Router();
const DB_PATH = path.join(__dirname, '../data/db.json');

function readDb() {
  if (!fs.existsSync(DB_PATH)) return { products: [], categories: [], deletedProductIds: [] };
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
}

function writeDb(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// GET /api/products - Get all products with optional filtering/search
router.get('/', async (req, res) => {
  const { category, search, subcategory } = req.query;

  if (isMongoConnected()) {
    try {
      let filter = {};

      if (category) {
        const catRegex = new RegExp(category, 'i');
        filter.$or = [
          { category: catRegex },
          { categories: catRegex }
        ];
      }

      if (subcategory) {
        const subRegex = new RegExp(subcategory, 'i');
        filter.$or = [
          ...(filter.$or || []),
          { categories: subRegex },
          { name: subRegex }
        ];
      }

      if (search) {
        const qRegex = new RegExp(search.trim(), 'i');
        filter.$or = [
          ...(filter.$or || []),
          { name: qRegex },
          { slug: qRegex },
          { model: qRegex },
          { productCode: qRegex },
          { category: qRegex },
          { description: qRegex }
        ];
      }

      const [mongoProducts, deletedDocs] = await Promise.all([
        Product.find(filter).sort({ createdAt: -1 }).lean(),
        DeletedItem.find({ type: 'product' }).lean()
      ]);

      const deletedIds = deletedDocs.map(d => d.identifier.toLowerCase());
      const filtered = mongoProducts.filter(p => {
        const pId = String(p.id || '').toLowerCase();
        const pModel = String(p.model || '').toLowerCase();
        const pName = String(p.name || '').toLowerCase();
        const pSlug = String(p.slug || '').toLowerCase();
        return !deletedIds.includes(pId) && !deletedIds.includes(pModel) && !deletedIds.includes(pName) && !deletedIds.includes(pSlug);
      });

      return res.json({
        success: true,
        source: 'mongodb',
        count: filtered.length,
        products: filtered,
        deletedProductIds: deletedIds
      });
    } catch (err) {
      console.warn('MongoDB query fallback to local:', err.message);
    }
  }

  // Local JSON fallback
  const db = readDb();
  let products = db.products || [];

  if (category) {
    const catLower = category.toLowerCase();
    products = products.filter(p => 
      (p.category && p.category.toLowerCase().includes(catLower)) ||
      (p.categories && p.categories.some(c => c.toLowerCase().includes(catLower)))
    );
  }

  if (subcategory) {
    const subLower = subcategory.toLowerCase();
    products = products.filter(p =>
      (p.categories && p.categories.some(c => c.toLowerCase().includes(subLower))) ||
      (p.name && p.name.toLowerCase().includes(subLower))
    );
  }

  if (search) {
    const q = search.toLowerCase().trim();
    products = products.filter(p =>
      (p.name && p.name.toLowerCase().includes(q)) ||
      (p.slug && p.slug.toLowerCase().includes(q)) ||
      (p.model && p.model.toLowerCase().includes(q)) ||
      (p.category && p.category.toLowerCase().includes(q)) ||
      (p.description && p.description.toLowerCase().includes(q))
    );
  }

  res.json({
    success: true,
    source: 'local_db',
    count: products.length,
    products,
    deletedProductIds: db.deletedProductIds || []
  });
});

// GET /api/products/categories - Get taxonomy tree
router.get('/categories', async (req, res) => {
  if (isMongoConnected()) {
    try {
      const categories = await Category.find().lean();
      if (categories && categories.length > 0) {
        return res.json({ success: true, source: 'mongodb', categories });
      }
    } catch (e) {}
  }
  const db = readDb();
  res.json({ success: true, source: 'local_db', categories: db.categories || [] });
});

// GET /api/products/datasheet-download - Direct download proxy/redirect
router.get('/datasheet-download', (req, res) => {
  const rawUrl = (req.query.url || '').trim();
  if (!rawUrl) {
    return res.status(400).json({ success: false, message: 'url query parameter is required' });
  }

  const driveMatch = rawUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ||
                     rawUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/) ||
                     rawUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);

  if (driveMatch && driveMatch[1]) {
    const fileId = driveMatch[1];
    const directUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
    return res.redirect(302, directUrl);
  }

  return res.redirect(302, rawUrl);
});

// GET /api/products/:id - Single product by ID or Slug
router.get('/:id', async (req, res) => {
  const param = req.params.id;

  if (isMongoConnected()) {
    try {
      const p = await Product.findOne({
        $or: [
          { id: param },
          { slug: param.toLowerCase() },
          { model: param }
        ]
      }).lean();
      if (p) return res.json({ success: true, source: 'mongodb', product: p });
    } catch (e) {}
  }

  const db = readDb();
  const product = (db.products || []).find(p => p.id == param || p.slug === param || p.model === param);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  res.json({ success: true, source: 'local_db', product });
});

// POST /api/products - Create product (Admin)
router.post('/', async (req, res) => {
  const { name, category, image, description, price, specs } = req.body;
  if (!name || !category) {
    return res.status(400).json({ success: false, message: 'Name and category are required' });
  }

  const modelCode = (req.body.productCode || req.body.model || name).trim();
  const pId = String(req.body.id || Date.now());
  const newProduct = {
    id: pId,
    name: name.trim(),
    model: modelCode,
    productCode: modelCode,
    slug: (req.body.slug || modelCode).toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    category,
    categories: Array.isArray(req.body.categories) ? req.body.categories : [category],
    price: parseFloat(price) || 0,
    brand: req.body.brand || 'Color On',
    image: image || '/color_on_bullet_hd.png',
    title: req.body.title || `${name} surveillance hardware.`,
    description: description || `${name} surveillance hardware.`,
    fullText: req.body.fullText || '',
    driveLink: req.body.driveLink || '',
    datasheetPdf: req.body.datasheetPdf || req.body.driveLink || '',
    datasheetPdfName: req.body.datasheetPdfName || `${modelCode}_datasheet.pdf`,
    keyFeatures: req.body.keyFeatures || [],
    functions: req.body.functions || {},
    specs: specs || {
      resolution: '1080P Full HD',
      nightVision: 'IR Night Vision 20m',
      casing: 'IP67 Weatherproof',
      audio: 'Built-in Mic',
      power: '12V DC'
    }
  };

  // Sync to MongoDB
  if (isMongoConnected()) {
    try {
      await Product.findOneAndUpdate(
        { id: pId },
        newProduct,
        { upsert: true, new: true }
      );
      // Remove from tombstone
      await DeletedItem.deleteMany({
        type: 'product',
        identifier: { $in: [pId.toLowerCase(), modelCode.toLowerCase(), name.toLowerCase()] }
      });
    } catch (err) {
      console.warn('MongoDB create product note:', err.message);
    }
  }

  // Sync to local JSON database
  const db = readDb();
  db.products = db.products || [];
  db.deletedProductIds = db.deletedProductIds || [];
  const ident = [pId.toLowerCase(), name.toLowerCase(), modelCode.toLowerCase()];
  db.deletedProductIds = db.deletedProductIds.filter(d => !ident.includes(String(d).toLowerCase()));
  db.products.unshift(newProduct);
  writeDb(db);

  res.status(201).json({ success: true, product: newProduct });
});

// POST /api/products/bulk - Bulk import datasheet products (Admin)
router.post('/bulk', async (req, res) => {
  const { products: incomingProducts, mode } = req.body;
  if (!incomingProducts || !Array.isArray(incomingProducts) || incomingProducts.length === 0) {
    return res.status(400).json({ success: false, message: 'Valid products array is required' });
  }

  const normalizedList = incomingProducts.map((p, idx) => {
    const name = (p.name || p.model || `Product-${idx + 1}`).trim();
    const model = (p.productCode || p.model || name).trim();
    const category = p.category || 'HD Analog Cameras';
    const pId = String(p.id || (Date.now() + idx));
    return {
      id: pId,
      name,
      model,
      productCode: model,
      brand: p.brand || 'Color On',
      slug: (p.slug || model || name).toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category,
      categories: Array.isArray(p.categories) ? p.categories : [category],
      price: parseFloat(p.price) || 0,
      image: p.image || '/color_on_bullet_hd.png',
      title: p.title || `${name} surveillance hardware.`,
      description: p.description || `${name} surveillance hardware.`,
      fullText: p.fullText || '',
      driveLink: p.driveLink || '',
      datasheetPdf: p.datasheetPdf || p.driveLink || '',
      datasheetPdfName: p.datasheetPdfName || `${model}_datasheet.pdf`,
      keyFeatures: p.keyFeatures || [],
      functions: p.functions || {},
      specs: p.specs || {
        resolution: p.resolution || '1080P Full HD',
        nightVision: p.nightVision || '10-20m LED / IR',
        casing: p.casing || 'IP67 Weatherproof',
        audio: p.audio || 'Built-in Mic',
        power: p.power || '12V DC',
        sensor: p.sensor || '1/2.8" CMOS'
      }
    };
  });

  // Sync to MongoDB
  if (isMongoConnected()) {
    try {
      if (mode === 'replace') {
        await Product.deleteMany({});
      }
      for (const p of normalizedList) {
        await Product.findOneAndUpdate({ id: p.id }, p, { upsert: true });
      }
      const idsToClear = normalizedList.flatMap(p => [
        p.id.toLowerCase(),
        (p.model || '').toLowerCase(),
        (p.name || '').toLowerCase()
      ]);
      await DeletedItem.deleteMany({ type: 'product', identifier: { $in: idsToClear } });
    } catch (err) {
      console.warn('MongoDB bulk import note:', err.message);
    }
  }

  // Sync to local JSON database
  const db = readDb();
  db.products = db.products || [];
  db.deletedProductIds = db.deletedProductIds || [];
  const importedIdentifiers = new Set(
    normalizedList.flatMap(p => [String(p.id).toLowerCase(), (p.name || '').toLowerCase(), (p.model || '').toLowerCase()])
  );
  db.deletedProductIds = db.deletedProductIds.filter(d => !importedIdentifiers.has(String(d).toLowerCase()));

  if (mode === 'replace') {
    db.products = normalizedList;
  } else {
    normalizedList.forEach(np => {
      const existingIdx = db.products.findIndex(ep => 
        (ep.name || '').toLowerCase() === np.name.toLowerCase() || 
        (ep.model || '').toLowerCase() === np.model.toLowerCase() ||
        String(ep.id) === String(np.id)
      );
      if (existingIdx >= 0) {
        db.products[existingIdx] = { ...db.products[existingIdx], ...np };
      } else {
        db.products.unshift(np);
      }
    });
  }
  writeDb(db);

  res.status(201).json({
    success: true,
    count: normalizedList.length,
    message: `Successfully imported ${normalizedList.length} products.`
  });
});

// PUT /api/products/:id - Update product (Admin)
router.put('/:id', async (req, res) => {
  const param = String(req.params.id).trim();
  const paramLower = param.toLowerCase();
  const updates = req.body;

  let updatedProduct = null;

  // Sync to MongoDB
  if (isMongoConnected()) {
    try {
      const modelCode = (updates.productCode || updates.model || param).trim();
      updatedProduct = await Product.findOneAndUpdate(
        {
          $or: [
            { id: param },
            { slug: paramLower },
            { model: paramLower },
            { name: paramLower }
          ]
        },
        {
          $set: {
            ...updates,
            model: modelCode,
            productCode: modelCode
          }
        },
        { new: true, upsert: false }
      ).lean();
    } catch (err) {
      console.warn('MongoDB update product note:', err.message);
    }
  }

  // Sync to local JSON database
  const db = readDb();
  db.products = db.products || [];
  const index = db.products.findIndex(p => 
    String(p.id) === param || 
    (p.slug && p.slug.toLowerCase() === paramLower) || 
    (p.model && p.model.toLowerCase() === paramLower) || 
    (p.name && p.name.toLowerCase() === paramLower)
  );

  if (index >= 0) {
    const current = db.products[index];
    const modelCode = (updates.productCode || updates.model || current.productCode || current.model || current.name).trim();
    const localUpdated = {
      ...current,
      ...updates,
      id: current.id,
      name: updates.name || current.name,
      model: modelCode,
      productCode: modelCode,
      driveLink: updates.driveLink !== undefined ? updates.driveLink : (current.driveLink || ''),
      datasheetPdf: updates.datasheetPdf !== undefined ? updates.datasheetPdf : (current.datasheetPdf || ''),
      datasheetPdfName: updates.datasheetPdfName !== undefined ? updates.datasheetPdfName : (current.datasheetPdfName || `${modelCode}_datasheet.pdf`),
      specs: { ...(current.specs || {}), ...(updates.specs || {}) }
    };
    db.products[index] = localUpdated;
    writeDb(db);
    if (!updatedProduct) updatedProduct = localUpdated;
  }

  if (!updatedProduct) {
    return res.status(404).json({ success: false, message: 'Product not found to update' });
  }

  res.json({ success: true, product: updatedProduct, message: 'Product updated successfully in database' });
});

router.patch('/:id', (req, res) => {
  req.method = 'PUT';
  router.handle(req, res);
});

// DELETE /api/products/:id - Delete product permanently (Admin)
router.delete('/:id', async (req, res) => {
  const param = String(req.params.id).trim();
  const paramLower = param.toLowerCase();

  // Sync to MongoDB
  if (isMongoConnected()) {
    try {
      const toDelete = await Product.find({
        $or: [
          { id: param },
          { slug: paramLower },
          { model: paramLower },
          { name: paramLower }
        ]
      }).lean();

      await Product.deleteMany({
        $or: [
          { id: param },
          { slug: paramLower },
          { model: paramLower },
          { name: paramLower }
        ]
      });

      const idsToAdd = [param, paramLower];
      toDelete.forEach(p => {
        if (p.id) idsToAdd.push(String(p.id).toLowerCase());
        if (p.model) idsToAdd.push(p.model.toLowerCase());
        if (p.name) idsToAdd.push(p.name.toLowerCase());
        if (p.slug) idsToAdd.push(p.slug.toLowerCase());
      });

      for (const idStr of [...new Set(idsToAdd)]) {
        await DeletedItem.findOneAndUpdate(
          { identifier: idStr },
          { type: 'product', identifier: idStr },
          { upsert: true }
        );
      }
    } catch (err) {
      console.warn('MongoDB delete product note:', err.message);
    }
  }

  // Sync to local JSON database
  const db = readDb();
  db.products = db.products || [];
  db.deletedProductIds = db.deletedProductIds || [];
  const initialLength = db.products.length;

  const matched = db.products.filter(p => 
    String(p.id) === param || 
    (p.slug && p.slug.toLowerCase() === paramLower) || 
    (p.model && p.model.toLowerCase() === paramLower) || 
    (p.name && p.name.toLowerCase() === paramLower)
  );

  db.products = db.products.filter(p => 
    String(p.id) !== param && 
    (!p.slug || p.slug.toLowerCase() !== paramLower) && 
    (!p.model || p.model.toLowerCase() !== paramLower) && 
    (!p.name || p.name.toLowerCase() !== paramLower)
  );

  const idsToAdd = [param, paramLower];
  matched.forEach(p => {
    if (p.id) idsToAdd.push(String(p.id).toLowerCase());
    if (p.model) idsToAdd.push(p.model.toLowerCase());
    if (p.name) idsToAdd.push(p.name.toLowerCase());
    if (p.slug) idsToAdd.push(p.slug.toLowerCase());
  });

  idsToAdd.forEach(item => {
    if (item && !db.deletedProductIds.includes(item)) {
      db.deletedProductIds.push(item);
    }
  });

  writeDb(db);

  res.json({
    success: true,
    deletedCount: initialLength - db.products.length,
    message: 'Product permanently removed from database'
  });
});

module.exports = router;
