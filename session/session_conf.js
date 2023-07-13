const express = require("express");
const session = require('express-session');
const connection = require("../db/dbconfig");
const MySQLStore = require('express-mysql-session')(session);

const sess = express();

const createSessionsTableQuery = `
  CREATE TABLE IF NOT EXISTS sessions (
    session_id VARCHAR(255) NOT NULL,
    expires BIGINT NOT NULL,
    data TEXT,
    PRIMARY KEY (session_id)
  );
`;
connection.query(createSessionsTableQuery, (err) => {
  if (err) {
    console.error('Error creating sessions table:', err);
    return;
  }
  console.log('Sessions table created');
});
const createSessionEmailsTableQuery = `
  CREATE TABLE IF NOT EXISTS session_emails (
    session_id VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    timestamp DATETIME NOT NULL,
    PRIMARY KEY (session_id),
    CONSTRAINT fk_session_emails FOREIGN KEY (session_id) REFERENCES sessions (session_id) ON DELETE CASCADE
  );
`;

connection.query(createSessionEmailsTableQuery, (err) => {
  if (err) {
    console.error('Error creating session_emails table:', err);
    return;
  }
  console.log('Session_emails table created');
});
const sessionStore = new MySQLStore({
  clearExpired: true,
  createDatabaseTable: false, // We manually create the tables
  endConnectionOnClose: true,
  expiration: 86400000,
  checkExpirationInterval: 1000 * 60,
  connection: connection,
  createDatabaseTable: false,
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'push@jangra',
  database: 'nodejstest',
});


sess.use(session({
  name: 'sessionID',
  secret: 'plk,mjkjnasdg353-/dgdsFa21/a/dsg',
  cookie: { maxAge: 1000 * 60 * 60 },
  resave: false,
  saveUninitialized: true,
  store: sessionStore

  // store: sessionStore
}));

module.exports = sess;