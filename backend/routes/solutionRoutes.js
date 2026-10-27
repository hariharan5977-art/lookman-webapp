const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const DB_PATH = path.join(__dirname, '../data/db.json');

function readDb() {
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
}

// GET /api/solutions - All solutions
router.get('/', (req, res) => {
  const db = readDb();
  res.json({ success: true, solutions: db.solutions || [] });
});

module.exports = router;
