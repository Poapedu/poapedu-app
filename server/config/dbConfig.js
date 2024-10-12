// config/dbConfig.js
const mysql = require("mysql2/promise");

const db = mysql.createPool({
  host: process.env.PROD_MYSQL_HOST,
  user: process.env.PROD_MYSQL_USER,
  password: process.env.PROD_MYSQL_PASS,
  database: process.env.PROD_MYSQL_DB,
});

module.exports = db;