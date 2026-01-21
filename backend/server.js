//Import libraries
const express = require('express');
const cors = require('cors');
require('dotenv').config();

//Create Express app
const app = express();

//Middleware - allow frontend to talk to backend
app.use(cors());

//Parse incoming JSON requests
app.use(express.json());


//Routes
//Test endpoints - check if server is running
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running!' });
});


//Start server on port 3001
const PORT = 3001;

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

server.on('error', (err) => {
  console.error('Server error:', err);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});