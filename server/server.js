const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'your_mysql_username',
  password: 'your_mysql_password',
  database: 'your_database_name'
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to MySQL database');
});

/** 
 * Newsletter subscription API
 */
app.post('/subscribe', (req, res) => {
  const { email } = req.body;
  const sql = 'INSERT INTO newsletters (email) VALUES (?)';
  
  db.query(sql, [email], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      res.status(500).json({ success: false, message: 'Subscription failed' });
    } else {
      res.json({ success: true, message: 'Subscription successful' });
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));