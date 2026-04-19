const db = require('../db');

module.exports = (app) => {

  // KPI summary endpoint
  app.get('/api/kpis', (req, res) => {
    const { startDate, endDate } = req.query;

    // Base KPI query (count, total, average)
    let sql = `
      SELECT 
        COUNT(*) AS BidCount,
        SUM(WinningBid) AS TotalBidVolume,
        AVG(WinningBid) AS AvgBidAmount
      FROM bids
      WHERE 1=1
    `;

    const params = [];

    // Optional date range filter
    if (startDate && endDate) {
      sql += " AND CloseDate BETWEEN ? AND ?";
      params.push(startDate, endDate);
    }

    // Execute KPI query
    db.query(sql, params, (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json(results[0]); // Return KPI row
    });
  });

};
