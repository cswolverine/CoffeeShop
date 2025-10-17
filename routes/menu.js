const express = require('express');
const router = express.Router();
const db = require('../db');
const fs = require('fs');
const path = require('path');

// Simple approach: if data/menu.json exists use it; otherwise load menu table
const menuJsonPath = path.join(__dirname, '..', 'data', 'menu.json');

router.get('/', (req, res, next) => {
  if (fs.existsSync(menuJsonPath)) {
    const raw = fs.readFileSync(menuJsonPath, 'utf8');
    try {
      return res.json(JSON.parse(raw));
    } catch (err) {
      return next(err);
    }
  }
  // fallback to DB
  db.all('SELECT id, name, description, price, active FROM menu WHERE active = 1', (err, rows) => {
    if (err) return next(err);
    res.json(rows);
  });
});

// admin: add menu item (protected by ADMIN_PASSWORD env var)
router.post('/', (req, res, next) => {
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';
  const provided = req.headers['x-admin-password'] || req.body.adminPassword;
  if (!ADMIN_PASSWORD || provided !== ADMIN_PASSWORD) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  const { name, description = '', price } = req.body;
  if (!name || typeof price !== 'number') return res.status(400).json({ error: 'Invalid payload' });
  db.run('INSERT INTO menu (name, description, price) VALUES (?, ?, ?)', [name, description, price], function (err) {
    if (err) return next(err);
    res.status(201).json({ id: this.lastID, name, description, price });
  });
});

module.exports = router;
