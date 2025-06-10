const mysql = require('mysql2/promise');
require('dotenv').config();

// Database 1 - Users (existing)
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  bigIntAsString: true,
});

const db2 = mysql.createPool({
  host: process.env.DB2_HOST,
  user: process.env.DB2_USER,
  password: process.env.DB2_PASSWORD,
  database: process.env.DB2_NAME,
  port: process.env.DB2_PORT,
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = { pool, db2 };