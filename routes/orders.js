const express = require('express');
const router = express.Router();
const db = require('../db');

// Create an order
// Body: { items: [{id, name, qty, price}], total: number, customer_name, customer_email }
router.post('/', (req, res, next) => {
  try {
    const { items, total, customer_name, customer_email } = req.body;
    if (!items || !Array.isArray(items) || typeof total !== 'number') return res.status(400).json({ error: 'Invalid order' });
    const itemsStr = JSON.stringify(items);
    db.run(
      'INSERT INTO orders (items, total, customer_name, customer_email) VALUES (?, ?, ?, ?)',
      [itemsStr, total, customer_name || '', customer_email || ''],
      function (err) {
        if (err) return next(err);
        const order = { id: this.lastID, items, total, customer_name, customer_email, status: 'pending' };
        // Optionally send email here using SENDGRID_API_KEY (not implemented)
        res.status(201).json(order);
      }
    );
  } catch (err) {
    next(err);
  }
});

// Admin: list orders (protected by ADMIN_PASSWORD)
router.get('/', (req, res, next) => {
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';
  const provided = req.headers['x-admin-password'] || req.query.adminPassword;
  if (!ADMIN_PASSWORD || provided !== ADMIN_PASSWORD) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  db.all('SELECT id, items, total, customer_name, customer_email, status, created_at FROM orders ORDER BY created_at DESC', (err, rows) => {
    if (err) return next(err);
    const formatted = rows.map(r => ({ ...r, items: JSON.parse(r.items) }));
    res.json(formatted);
  });
});

router.get('/:id', (req, res, next) => {
  const id = Number(req.params.id);
  db.get('SELECT id, items, total, customer_name, customer_email, status, created_at FROM orders WHERE id = ?', [id], (err, row) => {
    if (err) return next(err);
    if (!row) return res.status(404).json({ error: 'Not found' });
    row.items = JSON.parse(row.items);
    res.json(row);
  });
});

module.exports = router;
