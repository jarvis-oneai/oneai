// db.js (Postgres example)
const { Pool } = require('pg');
const pool = new Pool({
  host: "prod-oneai-jarvis.cluster-cjq800a2iegm.eu-north-1.rds.amazonaws.com",
  user: "shinobi",
  password: "xkMYyhbpuhQZwqVzTNCK",
  database: "oneai_jarvis",
  port: 5432,
});
module.exports = pool;
