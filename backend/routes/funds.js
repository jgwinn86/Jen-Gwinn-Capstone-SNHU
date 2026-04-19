// Return funds with role-based permissions

module.exports = (app, db) => {
  app.get('/api/funds', (req, res) => {
    const role = req.query.role || 'general';

    // Query: retrieve all funds from the database
    const sql = 'SELECT id, name, fundType FROM funds';

    db.query(sql, (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      // Role filter: restrict Enterprise to admin users
      let visibleFunds;
      if (role === 'admin') {
        visibleFunds = results;
      } else {
        visibleFunds = results.filter(f =>
          f.fundType === 'Public' || f.fundType === 'Branch'
        );
      }

      // Response: return filtered fund list
      res.json(visibleFunds);
    });
  });
};
