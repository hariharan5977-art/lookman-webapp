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
  res.json({ success: true, inquiries: db.inquiries || [] });
});

// POST /api/inquiries - Submit contact/quote inquiry
router.post('/', (req, res) => {
  const { name, email, phone, company, solution, message } = req.body;
  if (!name || (!email && !phone)) {
    return res.status(400).json({ success: false, message: 'Name and either email or phone are required' });
  }

  const db = readDb();
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

module.exports = router;
