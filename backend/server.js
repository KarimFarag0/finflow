//AUTHENTICATION OVERVIEW
//When a user signs up or login in, heres what happens:
//1.User sends email + password -> server
//2. Server hashes the password (never stores plain text)
//3. Server creates a JWT token (proof of identity) 
//4. Token is sent back to user (user stores it locally)
//5. For future request, user sends token (proves theyre logged in) 


//Import libraries
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./db');

//Create Express app
const app = express();

//Middleware - allow frontend to talk to backend
app.use(cors());

//Parse incoming JSON requests
app.use(express.json());

//Import auth routes
const authRoutes = require('./routes/auth');
const transactionRoutes = require('./routes/transactions');

//Use auth routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);

//Routes
//Test endpoints - check if server is running
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running!' });
});


//Test database connection
app.get('/api/db-test', async (req, res) => {
  try{
    const result = await pool.query('SELECT NOW()');
    res.json({
      status: 'Database connected!',
      timestamp: result.rows[0]
    });
  }catch (err){
    res.status(500).json({error: 'Database connection failed', details: err.message});
  }
});

//Start server on port 3001
const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

server.on('error', (err) => {
  console.error('Server error:', err);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});