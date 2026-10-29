const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config();

const Product = require('../models/Product');
const Inquiry = require('../models/Inquiry');
const User = require('../models/User');
const Solution = require('../models/Solution');
const Category = require('../models/Category');
const DeletedItem = require('../models/DeletedItem');

const DEFAULT_URI = 'mongodb+srv://harilkm65_db_user:ZG4jcj2Do33VqOcM@cluster0.n1vq1ll.mongodb.net/lookman?retryWrites=true&w=majority';
const DB_PATH = path.join(__dirname, '../data/db.json');

async function runMigration() {
  const uri = process.env.MONGODB_URI || DEFAULT_URI;
  console.log('Connecting to MongoDB at:', uri.replace(/:([^@]+)@/, ':****@'));

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000
    });
    console.log('✓ Connected to MongoDB Cluster successfully!\n');
  } catch (err) {
    console.error('✗ Failed to connect to MongoDB Cluster:', err.message);
    console.error('\nNOTE: If you see "bad auth : authentication failed":');
    console.error('1. Check MongoDB Atlas -> Database Access -> ensure user "harilkm65_db_user" has the correct password.');
    console.error('2. Check MongoDB Atlas -> Network Access -> ensure "0.0.0.0/0" (Allow access from anywhere) is active.\n');
    process.exit(1);
  }

  if (!fs.existsSync(DB_PATH)) {
    console.error('✗ Local database file not found at:', DB_PATH);
    process.exit(1);
  }

  const local = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));

  // 1. Admin User
  if (local.admin) {
    const adminUser = await User.findOneAndUpdate(
      { username: local.admin.username.toLowerCase() },
      {
        username: local.admin.username.toLowerCase(),
        passwordHash: local.admin.passwordHash,
        plainPasswordHint: local.admin.plainPasswordHint || '',
        role: local.admin.role || 'administrator',
        company: local.admin.company || 'LOOKMAN DISTRIBUTION PRIVATE LIMITED'
      },
      { upsert: true, new: true }
    );
    console.log(`✓ Admin user migrated: ${adminUser.username} (${adminUser.role})`);
  }

  // 2. Categories
  let catCount = 0;
  if (Array.isArray(local.categories)) {
    for (const c of local.categories) {
      await Category.findOneAndUpdate(
        { id: c.id },
        { id: c.id, name: c.name, subcategories: c.subcategories || [] },
        { upsert: true }
      );
      catCount++;
    }
    console.log(`✓ Categories migrated: ${catCount} categories`);
  }

  // 3. Solutions
  let solCount = 0;
  if (Array.isArray(local.solutions)) {
    for (const s of local.solutions) {
      await Solution.findOneAndUpdate(
        { id: s.id },
        {
          id: s.id,
          title: s.title,
          category: s.category || '',
          description: s.description || '',
          image: s.image || '',
          features: s.features || []
        },
        { upsert: true }
      );
      solCount++;
    }
    console.log(`✓ Solutions migrated: ${solCount} solution templates`);
  }

  // 4. Products
  let prodCount = 0;
  if (Array.isArray(local.products)) {
    for (const p of local.products) {
      const pId = String(p.id || p.model || Date.now());
      await Product.findOneAndUpdate(
        { id: pId },
        {
          id: pId,
          name: p.name,
          model: p.model || p.name,
          productCode: p.productCode || p.model,
          slug: (p.slug || p.model || p.name).toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          brand: p.brand || 'Color On',
          category: p.category || 'HD Analog Cameras',
          categories: Array.isArray(p.categories) ? p.categories : [p.category || 'HD Analog Cameras'],
          price: Number(p.price) || 0,
          image: p.image || '/color_on_bullet_hd.png',
          title: p.title || p.name,
          description: p.description || '',
          fullText: p.fullText || '',
          driveLink: p.driveLink || '',
          datasheetPdf: p.datasheetPdf || '',
          datasheetPdfName: p.datasheetPdfName || '',
          keyFeatures: p.keyFeatures || [],
          specs: p.specs || {},
          functions: p.functions || {}
        },
        { upsert: true }
      );
      prodCount++;
    }
    console.log(`✓ Products migrated: ${prodCount} authentic products`);
  }

  // 5. Inquiries
  let inqCount = 0;
  if (Array.isArray(local.inquiries)) {
    for (const inq of local.inquiries) {
      const inqId = String(inq.id || Date.now());
      await Inquiry.findOneAndUpdate(
        { id: inqId },
        {
          id: inqId,
          name: inq.name,
          email: inq.email || '',
          phone: inq.phone || '',
          company: inq.company || '',
          solution: inq.solution || 'General Inquiry',
          message: inq.message || '',
          selectionMode: inq.selectionMode || 'products',
          selectedProducts: inq.selectedProducts || [],
          selectedAreas: inq.selectedAreas || [],
          cameraCount: inq.cameraCount || 0,
          createdAt: inq.createdAt ? new Date(inq.createdAt) : new Date()
        },
        { upsert: true }
      );
      inqCount++;
    }
    console.log(`✓ Inquiries migrated: ${inqCount} customer inquiries`);
  }

  // 6. Deleted Tombstones
  let tombCount = 0;
  if (Array.isArray(local.deletedProductIds)) {
    for (const d of local.deletedProductIds) {
      if (!d) continue;
      await DeletedItem.findOneAndUpdate(
        { identifier: String(d).toLowerCase() },
        { type: 'product', identifier: String(d).toLowerCase() },
        { upsert: true }
      );
      tombCount++;
    }
  }
  if (Array.isArray(local.deletedInquiryIds)) {
    for (const d of local.deletedInquiryIds) {
      if (!d) continue;
      await DeletedItem.findOneAndUpdate(
        { identifier: String(d).toLowerCase() },
        { type: 'inquiry', identifier: String(d).toLowerCase() },
        { upsert: true }
      );
      tombCount++;
    }
  }
  console.log(`✓ Tombstone records migrated: ${tombCount} identifiers`);

  console.log('\n=========================================');
  console.log('🎉 Full Migration to MongoDB Atlas Complete!');
  console.log('=========================================');
  process.exit(0);
}

runMigration().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});

