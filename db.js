// db.js
const sqlite3 = require('sqlite3').verbose();

const dbConfig = {
  host: 'libsql://afastdb-stefanopedicinogit.aws-eu-west-1.turso.io',
};

async function connect() {
  try {
    const connection = new sqlite3.Database({
      uri: dbConfig.host,
    });
    return connection;
  } catch (error) {
    console.error('Error connecting to database:', error);
    throw error;
  }
}

module.exports = { connect };