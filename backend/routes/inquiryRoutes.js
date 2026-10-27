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

// GET /api/inquiries - List all inquiries (Admin)
router.get('/', (req, res) => {
  const db = readDb();
  db.inquiries = db.inquiries || [];
  db.deletedInquiryIds = db.deletedInquiryIds || [];
  res.json({ 
    success: true, 
    inquiries: db.inquiries,
    deletedInquiryIds: db.deletedInquiryIds 
  });
});

// POST /api/inquiries - Submit contact/quote inquiry
router.post('/', (req, res) => {
  const { name, email, phone, company, solution, message } = req.body;
  if (!name || (!email && !phone)) {
    return res.status(400).json({ success: false, message: 'Name and either email or phone are required' });
  }

  const db = readDb();
  db.inquiries = db.inquiries || [];
  db.deletedInquiryIds = db.deletedInquiryIds || [];

  const newInquiry = {
    id: Date.now(),
    name,
    email: email || '',
    phone: phone || '',
    company: company || '',
    solution: solution || 'General Inquiry',
    message: message || '',
    createdAt: new Date().toISOString()
  };

  db.inquiries.unshift(newInquiry);
  writeDb(db);

  res.status(201).json({
    success: true,
    message: 'Thank you for reaching out! Our security team will contact you shortly.',
    inquiry: newInquiry
  });
});

// DELETE /api/inquiries/:id - Delete single inquiry permanently (Admin)
router.delete('/:id', (req, res) => {
  const db = readDb();
  db.inquiries = db.inquiries || [];
  db.deletedInquiryIds = db.deletedInquiryIds || [];
  const param = String(req.params.id).trim();

  const initialCount = db.inquiries.length;
  db.inquiries = db.inquiries.filter(i => String(i.id) !== param);

  if (!db.deletedInquiryIds.includes(param)) {
    db.deletedInquiryIds.push(param);
  }

  writeDb(db);

  res.json({
    success: true,
    message: 'Inquiry deleted successfully from database',
    id: param,
    deletedCount: initialCount - db.inquiries.length
  });
});

// DELETE /api/inquiries - Bulk delete inquiries (Admin)
router.delete('/', (req, res) => {
  const db = readDb();
  db.inquiries = db.inquiries || [];
  db.deletedInquiryIds = db.deletedInquiryIds || [];
  const { ids } = req.body || {};

  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ success: false, message: 'Valid array of inquiry IDs is required' });
  }

  const idSet = new Set(ids.map(String));
  const initialCount = db.inquiries.length;
  db.inquiries = db.inquiries.filter(i => !idSet.has(String(i.id)));
  db.deletedInquiryIds = [...new Set([...db.deletedInquiryIds, ...ids.map(String)])];

  writeDb(db);

  res.json({
    success: true,
    message: `Successfully deleted ${initialCount - db.inquiries.length} inquiries`,
    deletedCount: initialCount - db.inquiries.length
  });
});

module.exports = router;

