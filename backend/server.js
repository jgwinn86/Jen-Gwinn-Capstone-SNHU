const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.send('Backend is running');
});

// Load routes
require('./routes/bids')(app);
require('./routes/kpis')(app);
require('./routes/funds')(app, db);


app.listen(3000, () => {
  console.log('Server running on port 3000');
});
