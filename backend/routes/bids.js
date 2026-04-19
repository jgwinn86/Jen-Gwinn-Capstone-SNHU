const db = require('../db');

module.exports = (app) => {

// Get all bids (general users only — Enterprise excluded)
  app.get('/api/bids', (req, res) => {
    const sql = "SELECT * FROM bids WHERE Fund != 'Enterprise' ORDER BY CloseDate DESC";

    db.query(sql, (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json(results);
    });
  });

  // Get a single bid by ID
  app.get('/api/bids/:id', (req, res) => {
    const sql = "SELECT * FROM bids WHERE id = ?";
    
    db.query(sql, [req.params.id], (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json(results[0]);
    });
  });

 // Filter bids (general users — Enterprise excluded)
app.get('/api/bids/filter', (req, res) => {
  const { department, fund, startDate, endDate, minAmount, maxAmount } = req.query;

  let sql = "SELECT * FROM bids WHERE Fund != 'Enterprise'";
  const params = [];

  if (department) {
    sql += " AND Department = ?";
    params.push(department);
  }

  if (fund) {
    sql += " AND Fund = ?";
    params.push(fund);
  }

  if (startDate && endDate) {
    sql += " AND CloseDate BETWEEN ? AND ?";
    params.push(startDate, endDate);
  }

  if (minAmount && maxAmount) {
    sql += " AND WinningBid BETWEEN ? AND ?";
    params.push(minAmount, maxAmount);
  }

  sql += " ORDER BY CloseDate DESC";

  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

};
