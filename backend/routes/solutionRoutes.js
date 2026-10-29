const express = require('express');
const fs = require('fs');
const path = require('path');
const Solution = require('../models/Solution');
const { isMongoConnected } = require('../config/db');

const router = express.Router();
const DB_PATH = path.join(__dirname, '../data/db.json');

function readDb() {
  if (!fs.existsSync(DB_PATH)) return { solutions: [] };
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
}

function writeDb(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// GET /api/solutions - All solutions
router.get('/', async (req, res) => {
  if (isMongoConnected()) {
    try {
      const solutions = await Solution.find().lean();
      if (solutions && solutions.length > 0) {
        return res.json({ success: true, source: 'mongodb', solutions });
      }
    } catch (e) {}
  }

  const db = readDb();
  res.json({ success: true, source: 'local_db', solutions: db.solutions || [] });
});

// POST /api/solutions - Create solution
router.post('/', async (req, res) => {
  const { title, category, description, image, features } = req.body;
  if (!title) {
    return res.status(400).json({ success: false, message: 'Title is required' });
  }

  const newSol = {
    id: String(req.body.id || Date.now()),
    title: title.trim(),
    category: category || 'Enterprise Solution',
    description: description || '',
    image: image || '',
    features: Array.isArray(features) ? features : []
  };

  if (isMongoConnected()) {
    try {
      await Solution.findOneAndUpdate({ id: newSol.id }, newSol, { upsert: true });
    } catch (e) {}
  }

  const db = readDb();
  db.solutions = db.solutions || [];
  db.solutions.unshift(newSol);
  writeDb(db);

  res.status(201).json({ success: true, solution: newSol });
});

// PUT /api/solutions/:id - Update solution
router.put('/:id', async (req, res) => {
  const param = String(req.params.id);
  const updates = req.body;

  if (isMongoConnected()) {
    try {
      await Solution.findOneAndUpdate({ id: param }, { $set: updates });
    } catch (e) {}
  }

  const db = readDb();
  db.solutions = db.solutions || [];
  const idx = db.solutions.findIndex(s => s.id === param);
  if (idx >= 0) {
    db.solutions[idx] = { ...db.solutions[idx], ...updates };
    writeDb(db);
    return res.json({ success: true, solution: db.solutions[idx] });
  }

  res.status(404).json({ success: false, message: 'Solution not found' });
});

// DELETE /api/solutions/:id - Delete solution
router.delete('/:id', async (req, res) => {
  const param = String(req.params.id);

  if (isMongoConnected()) {
    try {
      await Solution.deleteOne({ id: param });
    } catch (e) {}
  }

  const db = readDb();
  db.solutions = db.solutions || [];
  db.solutions = db.solutions.filter(s => s.id !== param);
  writeDb(db);

  res.json({ success: true, message: 'Solution deleted successfully' });
});

module.exports = router;
