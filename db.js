// db.js
const mysql = require('mysql2/promise');

const dbConfig = {
  host: 'sql8.freesqldatabase.com',
  database: 'sql8788291',
  user: 'sql8788291',
  password: 'bBdJriWPWv',
  port: 3306,
};

async function connect() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    console.log('Connected to database!');
    return connection;
  } catch (error) {
    console.error('Error connecting to database:', error);
    throw error;
  }
}

module.exports = { connect };