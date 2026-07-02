require('dotenv').config();
const fs = require('fs');
const path = require('path');

module.exports = {
  "development": {
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_DATABASE,
    "host": process.env.DB_HOST,
    "port": process.env.DB_PORT || 5432,
    "dialect": "postgres"
  },
  "test": {
    "dialect": "sqlite",
    "storage": ":memory:",
    "logging": false
  },
  "production": {
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_DATABASE,
    "host": process.env.DB_HOST,
    "port": process.env.DB_PORT || 5432,
    "dialect": "postgres",
    "dialectOptions": {
      "ssl": {
        "require": true,
        "rejectUnauthorized": true,
        "ca": fs.readFileSync(path.join(__dirname, "../certs/rds-global-bundle.pem")).toString()
      }
    }
  }
};