const express = require('express');
const fs = require('fs');
const path = require('path');
const Inquiry = require('../models/Inquiry');
const DeletedItem = require('../models/DeletedItem');
const { isMongoConnected } = require('../config/db');

const router = express.Router();
const DB_PATH = path.join(__dirname, '../data/db.json');

function readDb() {
  if (!fs.existsSync(DB_PATH)) return { inquiries: [], deletedInquiryIds: [] };
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
}

function writeDb(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// GET /api/inquiries - List all inquiries (Admin)
router.get('/', async (req, res) => {
  if (isMongoConnected()) {
    try {
      const [mongoInqs, deletedDocs] = await Promise.all([
        Inquiry.find().sort({ createdAt: -1 }).lean(),
        DeletedItem.find({ type: 'inquiry' }).lean()
      ]);

      const deletedIds = deletedDocs.map(d => d.identifier.toLowerCase());
      const filtered = mongoInqs.filter(i => {
        const iId = String(i.id || '').toLowerCase();
        const iPhone = String(i.phone || '').trim().toLowerCase();
        const iEmail = String(i.email || '').trim().toLowerCase();
        return !deletedIds.includes(iId) && (!iPhone || !deletedIds.includes(iPhone)) && (!iEmail || !deletedIds.includes(iEmail));
      });

      return res.json({
        success: true,
        source: 'mongodb',
        inquiries: filtered,
        deletedInquiryIds: deletedIds
      });
    } catch (err) {
      console.warn('MongoDB inquiries fetch note:', err.message);
    }
  }

  // Local JSON database fallback
  const db = readDb();
  db.inquiries = db.inquiries || [];
  db.deletedInquiryIds = db.deletedInquiryIds || [];
  res.json({ 
    success: true, 
    source: 'local_db',
    inquiries: db.inquiries,
    deletedInquiryIds: db.deletedInquiryIds 
  });
});

// POST /api/inquiries - Submit contact/quote inquiry
router.post('/', async (req, res) => {
  const { name, email, phone, company, solution, message, selectionMode, selectedProducts, selectedAreas, cameraCount } = req.body;
  if (!name || (!email && !phone)) {
    return res.status(400).json({ success: false, message: 'Name and either email or phone are required' });
  }

  const inqId = String(Date.now());
  const newInquiry = {
    id: inqId,
    name: name.trim(),
    email: (email || '').trim(),
    phone: (phone || '').trim(),
    company: (company || '').trim(),
    solution: solution || 'General Inquiry',
    message: message || '',
    selectionMode: selectionMode || 'products',
    selectedProducts: Array.isArray(selectedProducts) ? selectedProducts : [],
    selectedAreas: Array.isArray(selectedAreas) ? selectedAreas : [],
    cameraCount: Number(cameraCount) || 0,
    createdAt: new Date().toISOString()
  };

  // Sync to MongoDB
  if (isMongoConnected()) {
    try {
      await Inquiry.findOneAndUpdate(
        { id: inqId },
        { ...newInquiry, createdAt: new Date(newInquiry.createdAt) },
        { upsert: true, new: true }
      );
    } catch (err) {
      console.warn('MongoDB create inquiry note:', err.message);
    }
  }

  // Sync to local JSON database
  const db = readDb();
  db.inquiries = db.inquiries || [];
  db.deletedInquiryIds = db.deletedInquiryIds || [];
  db.inquiries.unshift(newInquiry);
  writeDb(db);

  res.status(201).json({
    success: true,
    message: 'Thank you for reaching out! Our security team will contact you shortly.',
    inquiry: newInquiry
  });
});

// DELETE /api/inquiries/:id - Delete single inquiry permanently (Admin)
router.delete('/:id', async (req, res) => {
  const param = String(req.params.id).trim();
  const paramLower = param.toLowerCase();

  // Sync to MongoDB
  if (isMongoConnected()) {
    try {
      const matched = await Inquiry.find({
        $or: [
          { id: param },
          { phone: param },
          { email: paramLower }
        ]
      }).lean();

      await Inquiry.deleteMany({
        $or: [
          { id: param },
          { phone: param },
          { email: paramLower }
        ]
      });

      const idsToAdd = [param, paramLower];
      matched.forEach(i => {
        if (i.id) idsToAdd.push(String(i.id));
        if (i.phone) idsToAdd.push(String(i.phone).trim());
        if (i.email) idsToAdd.push(String(i.email).trim().toLowerCase());
      });

      for (const idStr of [...new Set(idsToAdd)]) {
        if (!idStr) continue;
        await DeletedItem.findOneAndUpdate(
          { identifier: idStr.toLowerCase() },
          { type: 'inquiry', identifier: idStr.toLowerCase() },
          { upsert: true }
        );
      }
    } catch (err) {
      console.warn('MongoDB delete inquiry note:', err.message);
    }
  }

  // Sync to local JSON database
  const db = readDb();
  db.inquiries = db.inquiries || [];
  db.deletedInquiryIds = db.deletedInquiryIds || [];

  const initialCount = db.inquiries.length;
  const matchedLocal = db.inquiries.filter(i => 
    String(i.id) === param || 
    (i.phone && String(i.phone).trim() === param) ||
    (i.email && String(i.email).trim().toLowerCase() === paramLower)
  );

  db.inquiries = db.inquiries.filter(i => 
    String(i.id) !== param && 
    !(i.phone && String(i.phone).trim() === param) && 
    !(i.email && String(i.email).trim().toLowerCase() === paramLower)
  );

  const idsToAdd = [param, paramLower];
  matchedLocal.forEach(i => {
    if (i.id) idsToAdd.push(String(i.id));
    if (i.phone) idsToAdd.push(String(i.phone).trim());
    if (i.email) idsToAdd.push(String(i.email).trim().toLowerCase());
  });

  idsToAdd.forEach(item => {
    if (item && !db.deletedInquiryIds.includes(item)) {
      db.deletedInquiryIds.push(item);
    }
  });

  writeDb(db);

  res.json({
    success: true,
    message: 'Inquiry deleted successfully from database',
    id: param,
    deletedCount: initialCount - db.inquiries.length
  });
});

// DELETE /api/inquiries - Bulk delete inquiries (Admin)
router.delete('/', async (req, res) => {
  const { ids } = req.body || {};
  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ success: false, message: 'Valid array of inquiry IDs is required' });
  }

  const idList = ids.map(String);

  // Sync to MongoDB
  if (isMongoConnected()) {
    try {
      await Inquiry.deleteMany({ id: { $in: idList } });
      for (const idStr of idList) {
        await DeletedItem.findOneAndUpdate(
          { identifier: idStr.toLowerCase() },
          { type: 'inquiry', identifier: idStr.toLowerCase() },
          { upsert: true }
        );
      }
    } catch (err) {
      console.warn('MongoDB bulk delete note:', err.message);
    }
  }

  // Sync to local JSON database
  const db = readDb();
  db.inquiries = db.inquiries || [];
  db.deletedInquiryIds = db.deletedInquiryIds || [];

  const idSet = new Set(idList);
  const initialCount = db.inquiries.length;
  db.inquiries = db.inquiries.filter(i => !idSet.has(String(i.id)));
  db.deletedInquiryIds = [...new Set([...db.deletedInquiryIds, ...idList])];

  writeDb(db);

  res.json({
    success: true,
    message: `Successfully deleted ${initialCount - db.inquiries.length} inquiries`,
    deletedCount: initialCount - db.inquiries.length
  });
});

module.exports = router;
