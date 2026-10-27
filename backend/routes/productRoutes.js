const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const DB_PATH = path.join(__dirname, '../data/db.json');

function readDb() {
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
}

function writeDb(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// GET /api/products - Get all products with optional filtering/search
router.get('/', (req, res) => {
  const db = readDb();
  let products = db.products || [];
  const { category, search, subcategory } = req.query;

  if (category) {
    const catLower = category.toLowerCase();
    products = products.filter(p => 
      p.category.toLowerCase().includes(catLower) ||
      (p.categories && p.categories.some(c => c.toLowerCase().includes(catLower)))
    );
  }

  if (subcategory) {
    const subLower = subcategory.toLowerCase();
    products = products.filter(p =>
      (p.categories && p.categories.some(c => c.toLowerCase().includes(subLower))) ||
      p.name.toLowerCase().includes(subLower)
    );
  }

  if (search) {
    const q = search.toLowerCase().trim();
    products = products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.slug.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  }

  res.json({
    success: true,
    count: products.length,
    products,
    deletedProductIds: db.deletedProductIds || []
  });
});

// GET /api/products/categories - Get taxonomy tree
router.get('/categories', (req, res) => {
  const db = readDb();
  res.json({
    success: true,
    categories: db.categories || []
  });
});

// GET /api/products/datasheet-download - Direct download proxy/redirect for Google Drive & PDF datasheets
router.get('/datasheet-download', (req, res) => {
  const rawUrl = (req.query.url || '').trim();
  const filename = (req.query.filename || 'lookman_datasheet.pdf').trim();

  if (!rawUrl) {
    return res.status(400).json({ success: false, message: 'url query parameter is required' });
  }

  // Detect Google Drive link and convert to direct export URL
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
router.get('/:id', (req, res) => {
  const db = readDb();
  const param = req.params.id;
  const product = db.products.find(p => p.id == param || p.slug === param);

  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  res.json({ success: true, product });
});

// POST /api/products - Add product (Admin)
router.post('/', (req, res) => {
  const db = readDb();
  db.products = db.products || [];
  db.deletedProductIds = db.deletedProductIds || [];
  const { name, category, image, description, price, specs } = req.body;

  if (!name || !category) {
    return res.status(400).json({ success: false, message: 'Name and category are required' });
  }

  const modelCode = (req.body.productCode || req.body.model || name).trim();
  const newProduct = {
    id: Date.now(),
    name,
    model: modelCode,
    productCode: modelCode,
    slug: modelCode.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    category,
    categories: [category],
    price: parseFloat(price) || 0,
    brand: req.body.brand || 'Color On',
    image: image || '/CO-H-2BFDML(V).png',
    title: req.body.title || `${name} high-definition surveillance camera.`,
    description: description || `${name} high-definition surveillance camera.`,
    fullText: req.body.fullText || '',
    driveLink: req.body.driveLink || '',
    datasheetPdf: req.body.datasheetPdf || req.body.driveLink || '',
    datasheetPdfName: req.body.datasheetPdfName || `${modelCode}_datasheet.pdf`,
    keyFeatures: req.body.keyFeatures || [],
    functions: req.body.functions || {},
    specs: specs || {
      resolution: '1080P Full HD',
      nightVision: 'IR Night Vision',
      casing: 'IP66 Weatherproof',
      audio: 'Built-in Mic',
      power: '12V DC / PoE'
    }
  };

  // Remove from deletedProductIds if re-added
  const ident = [String(newProduct.id), newProduct.name.toLowerCase(), (newProduct.model || '').toLowerCase()];
  db.deletedProductIds = db.deletedProductIds.filter(d => !ident.includes(String(d).toLowerCase()));

  db.products.unshift(newProduct);
  writeDb(db);

  res.status(201).json({ success: true, product: newProduct });
});

// POST /api/products/bulk - Bulk import datasheet products (Admin)
router.post('/bulk', (req, res) => {
  const db = readDb();
  db.products = db.products || [];
  db.deletedProductIds = db.deletedProductIds || [];
  const { products: incomingProducts, mode } = req.body;

  if (!incomingProducts || !Array.isArray(incomingProducts) || incomingProducts.length === 0) {
    return res.status(400).json({ success: false, message: 'Valid products array is required' });
  }

  const normalizedList = incomingProducts.map((p, idx) => {
    const name = (p.name || p.model || `Product-${idx + 1}`).trim();
    const model = (p.productCode || p.model || name).trim();
    const category = p.category || 'HD Analog Cameras';
    return {
      id: p.id || (Date.now() + idx),
      name,
      model,
      productCode: model,
      brand: p.brand || 'Color On',
      slug: (p.slug || model || name).toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category,
      categories: Array.isArray(p.categories) ? p.categories : [category],
      price: parseFloat(p.price) || 0,
      image: p.image || '/CO-H-2BFDML(V).png',
      title: p.title || `${name} high-definition surveillance camera.`,
      description: p.description || `${name} high-definition surveillance camera.`,
      fullText: p.fullText || '',
      driveLink: p.driveLink || '',
      datasheetPdf: p.datasheetPdf || p.driveLink || '',
      datasheetPdfName: p.datasheetPdfName || `${model}_datasheet.pdf`,
      keyFeatures: p.keyFeatures || [],
      functions: p.functions || {},
      specs: p.specs || {
        resolution: p.resolution || '1080P Full HD',
        nightVision: p.nightVision || 'IR Night Vision 30m',
        casing: p.casing || 'IP67 Weatherproof Housing',
        audio: p.audio || 'Built-in Mic',
        power: p.power || 'PoE / 12V DC',
        sensor: p.sensor || '1/2.8" Progressive Scan CMOS'
      }
    };
  });

  // Remove imported models/names from deletedProductIds
  const importedIdentifiers = new Set(
    normalizedList.flatMap(p => [String(p.id).toLowerCase(), (p.name || '').toLowerCase(), (p.model || '').toLowerCase()])
  );
  db.deletedProductIds = db.deletedProductIds.filter(d => !importedIdentifiers.has(String(d).toLowerCase()));

  if (mode === 'replace') {
    db.products = normalizedList;
  } else {
    // Append or update existing models
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
  res.status(201).json({ success: true, count: normalizedList.length, message: `Successfully imported ${normalizedList.length} products.` });
});

// PUT /api/products/:id - Update product (Admin)
router.put('/:id', (req, res) => {
  const db = readDb();
  const param = String(req.params.id).trim();
  const paramLower = param.toLowerCase();
  db.products = db.products || [];
  db.deletedProductIds = db.deletedProductIds || [];

  const index = db.products.findIndex(p => 
    String(p.id) === param || 
    (p.slug && p.slug.toLowerCase() === paramLower) || 
    (p.model && p.model.toLowerCase() === paramLower) || 
    (p.name && p.name.toLowerCase() === paramLower)
  );

  const updates = req.body;
  if (index === -1) {
    const newProduct = {
      id: isNaN(Number(param)) ? Date.now() : Number(param),
      name: updates.name || updates.model || param,
      model: updates.model || updates.name || param,
      slug: (updates.model || updates.name || param).toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category: updates.category || 'HD IP Camera',
      categories: updates.categories || [updates.category || 'HD IP Camera'],
      price: parseFloat(updates.price) || 0,
      image: updates.image || '/SIP-VB401ADA.png',
      description: updates.description || 'Surveillance hardware from Lookman.',
      specs: updates.specs || {}
    };
    db.products.unshift(newProduct);
    writeDb(db);
    return res.json({ success: true, product: newProduct, message: 'Product created in DB' });
  }

  const current = db.products[index];
  const modelCode = (updates.productCode || updates.model || current.productCode || current.model || current.name).trim();
  const updatedProduct = {
    ...current,
    ...updates,
    id: current.id,
    name: updates.name || current.name,
    model: modelCode,
    productCode: modelCode,
    driveLink: updates.driveLink !== undefined ? updates.driveLink : (current.driveLink || ''),
    datasheetPdf: updates.datasheetPdf !== undefined ? updates.datasheetPdf : (current.datasheetPdf || ''),
    datasheetPdfName: updates.datasheetPdfName !== undefined ? updates.datasheetPdfName : (current.datasheetPdfName || `${modelCode}_datasheet.pdf`),
    specs: {
      ...(current.specs || {}),
      ...(updates.specs || {})
    }
  };

  db.products[index] = updatedProduct;
  writeDb(db);
  res.json({ success: true, product: updatedProduct, message: 'Product updated successfully in DB' });
});

router.patch('/:id', (req, res) => {
  req.method = 'PUT';
  router.handle(req, res);
});

// DELETE /api/products/:id - Delete product permanently (Admin)
router.delete('/:id', (req, res) => {
  const db = readDb();
  const param = String(req.params.id).trim();
  const paramLower = param.toLowerCase();
  db.products = db.products || [];
  db.deletedProductIds = db.deletedProductIds || [];

  const initialLength = db.products.length;

  // Find all matched products to record their model names & IDs
  const matched = db.products.filter(p => 
    String(p.id) === param || 
    (p.slug && p.slug.toLowerCase() === paramLower) || 
    (p.model && p.model.toLowerCase() === paramLower) || 
    (p.name && p.name.toLowerCase() === paramLower)
  );

  // Remove from products array
  db.products = db.products.filter(p => 
    String(p.id) !== param && 
    (!p.slug || p.slug.toLowerCase() !== paramLower) && 
    (!p.model || p.model.toLowerCase() !== paramLower) && 
    (!p.name || p.name.toLowerCase() !== paramLower)
  );

  // Record deleted identifiers permanently
  const idsToAdd = [param, paramLower];
  matched.forEach(p => {
    if (p.id) idsToAdd.push(String(p.id));
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
