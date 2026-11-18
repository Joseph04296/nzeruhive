require('dotenv').config();
const { Pool } = require('pg');
const local = (process.env.DATABASE_URL || '').includes('localhost');
module.exports = new Pool({ connectionString: process.env.DATABASE_URL, ssl: local ? false : { rejectUnauthorized: false } });
