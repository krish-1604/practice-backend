// config/db.js
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();
const db1 = mysql.createPool({
  host: process.env.DB1_HOST,
  user: process.env.DB1_USER,
  password: process.env.DB1_PASSWORD,
  database: process.env.DB1_NAME,
  port: process.env.DB1_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
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
  queueLimit: 0,
  bigIntAsString: true,
});

module.exports = {
  db1,
  db2,
};
