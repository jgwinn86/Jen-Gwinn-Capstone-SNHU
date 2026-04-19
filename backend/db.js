const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', //username
  password: 'Braydenw1!',   //password
  database: 'bids' 
});

db.connect(err => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('MySQL connected');
});

module.exports = db;
