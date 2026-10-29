let mongoose = null;
try {
  mongoose = require('mongoose');
} catch (e) {
  mongoose = null;
}

const fs = require('fs');
const path = require('path');

const Product = require('../models/Product');
const Inquiry = require('../models/Inquiry');
const User = require('../models/User');
const Solution = require('../models/Solution');
const Category = require('../models/Category');
const DeletedItem = require('../models/DeletedItem');

const DEFAULT_URI = 'mongodb+srv://harilkm65_db_user:ZG4jcj2Do33VqOcM@cluster0.n1vq1ll.mongodb.net/lookman?retryWrites=true&w=majority';
const DB_PATH = path.join(__dirname, '../data/db.json');

let isConnected = false;

function isMongoConnected() {
  return Boolean(mongoose && isConnected && mongoose.connection.readyState === 1);
}

async function seedFromLocalDb() {
  if (!isMongoConnected()) return false;
  try {
    if (!fs.existsSync(DB_PATH)) return false;
    const local = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));

    // 1. Seed Admin User
    if (local.admin && local.admin.username) {
      await User.findOneAndUpdate(
        { username: local.admin.username.toLowerCase() },
        {
          username: local.admin.username.toLowerCase(),
          passwordHash: local.admin.passwordHash,
          plainPasswordHint: local.admin.plainPasswordHint || '',
          role: local.admin.role || 'administrator',
          company: local.admin.company || 'LOOKMAN DISTRIBUTION PRIVATE LIMITED'
        },
        { upsert: true, returnDocument: 'after' }
      );
    }

    // 2. Seed Products
    if (Array.isArray(local.products) && local.products.length > 0) {
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
      }
    }

    // 3. Seed Categories
    if (Array.isArray(local.categories) && local.categories.length > 0) {
      for (const c of local.categories) {
        await Category.findOneAndUpdate(
          { id: c.id },
          { id: c.id, name: c.name, subcategories: c.subcategories || [] },
          { upsert: true }
        );
      }
    }

    // 4. Seed Solutions
    if (Array.isArray(local.solutions) && local.solutions.length > 0) {
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
      }
    }

    // 5. Seed Inquiries
    if (Array.isArray(local.inquiries) && local.inquiries.length > 0) {
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
      }
    }

    // 6. Seed Deleted Tombstones
    if (Array.isArray(local.deletedProductIds)) {
      for (const d of local.deletedProductIds) {
        if (!d) continue;
        await DeletedItem.findOneAndUpdate(
          { identifier: String(d).toLowerCase() },
          { type: 'product', identifier: String(d).toLowerCase() },
          { upsert: true }
        );
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
      }
    }

    console.log('✓ Successfully synchronized local data to MongoDB collections.');
    return true;
  } catch (err) {
    console.error('Error during local to MongoDB seeding:', err.message);
    return false;
  }
}

async function connectDB() {
  if (!mongoose) {
    console.warn('! Note: Mongoose is not installed in this environment yet.');
    console.warn('  Run: npm install --prefix backend');
    console.warn('  -> Using robust local JSON database fallback (backend/data/db.json). All features remain 100% active.');
    return false;
  }

  const uri = process.env.MONGODB_URI || DEFAULT_URI;

  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 8000
    });
    isConnected = true;
    console.log('✓ MongoDB Connected Successfully to Atlas Cluster');

    // Run initial migration/sync of local records to MongoDB in background
    seedFromLocalDb().catch(e => console.warn('Background sync note:', e.message));

    return true;
  } catch (err) {
    isConnected = false;
    console.warn(`! MongoDB Connection Notice: ${err.message}`);
    console.warn('  -> Using robust local JSON database fallback (backend/data/db.json). All features remain 100% active.');
    return false;
  }
}

if (mongoose && mongoose.connection) {
  mongoose.connection.on('disconnected', () => {
    isConnected = false;
  });

  mongoose.connection.on('reconnected', () => {
    isConnected = true;
    console.log('✓ MongoDB Reconnected');
  });
}

module.exports = {
  connectDB,
  isMongoConnected,
  seedFromLocalDb
};
