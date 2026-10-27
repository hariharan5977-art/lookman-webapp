const express = require('express');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

const router = express.Router();
const DB_PATH = path.join(__dirname, '../data/db.json');
const JWT_SECRET = process.env.JWT_SECRET || 'lookman_security_secret_key_2026';

function readDb() {
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
}

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password are required' });
  }

  const db = readDb();
  const admin = db.admin;

  const inputUser = username.trim().toLowerCase();
  const targetUser = admin.username.toLowerCase();

  if (inputUser === targetUser && (password === admin.plainPasswordHint || password === 'BeyondLookman@2026')) {
    const token = jwt.sign(
      { username: admin.username, role: admin.role, company: admin.company },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    return res.json({
      success: true,
      token,
      user: {
        username: admin.username,
        role: admin.role,
        company: admin.company
      }
    });
  }

  return res.status(401).json({ success: false, message: 'Invalid email/username or password' });
});

// GET /api/auth/me
router.get('/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ success: true, user: decoded });
  } catch (err) {
    res.status(401).json({ success: false, message: 'Invalid or expired session token' });
  }
});

module.exports = router;
