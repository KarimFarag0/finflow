const {Pool} = require('pg');
require ('dotenv').config();

//Create a connection pool to PostgreSQL
const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

//Test the connection
pool.on('connect', () => {
    console.log('✅ Connect to PostgreSQL database');
});

pool.on('error', () => {
    console.error('❌ Unexpected error on idle client', err);
});

module.exports = pool;