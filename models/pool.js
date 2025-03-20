const mysql = require('mysql2');
require('dotenv').config();

const database = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

database.getConnection((err, connection) => {
  if (err) {
    console.log('Database connection failed:', err);
  } else {
    console.log('Database connected successfully');
    connection.release(); // Release the test connection
  }
});

module.exports = database;
