// Libraries
const { Pool } = require("pg");
const dotenv = require("dotenv").config();

// Connection to the database
const pool = new Pool({
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  host: "localhost",
  port: 5432
});

// Export connection identifier
module.exports = { pool };
