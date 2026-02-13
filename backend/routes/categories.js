//Import express - the framework for handling HTTP requests
const express = require('express');

//IMport the databse connection pool so we can query PostgreSQL
const pool = require('../db');

//Import the verifyToken middleware - this checks if the user is logged in 
//If they dont have a valid token, they cant access this endpoint
const {verifyToken} = require('../middleware/auth');


const router = express.Router();

//Get all categories for the logged-in user
//Create a get route that fetches all categories
// router.get('/') means: When someone makes a GET request to /api/categories
// verifyToken = midleware that runs first - check if user is logged in
// async (req, res) = the function that handles request
    //req = what client sends
    //res = what client receives
router.get('/', verifyToken, async(req, res) => {
    try{
        //after verifyToken runs , it populates req.user with the logged in users info
        // we extract the user_id from the token
        const user_id = req.user.id;

        //Query the database to get ALL categories for this user
        //WHERE user_id = $1 means: only show categories that belong to this user
        // ORDER BY name means: sort them alphabetically by category name
        const result = await pool.query(
            'SELECT * FROM categories WHERE user_id = $1 ORDER BY name',
            [user_id]
        );

        // Send the categories back to the frontend as JSON
        // count = how many categories we found
        // categories = the actual category data (array of objects)
        res.json({
            count: result.rows.length,
            categories: result.rows
        });
    } catch (err) {
        console.error('Get categories error:', err);
        res.status(500).json({ error: 'Failed to fetch categories,', details: err.message});
    }
});

module.exports = router;