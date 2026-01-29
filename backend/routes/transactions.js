const express = require('express');
const pool = require('../db');
const {verifyToken} = require('../middleware/auth');

const router = express.Router();

// CREATE - Add new transaction
//Listening for POST request to /api/transactions
//verify token = middleware that checks if the user is logged in 
//Runs before the actual router handler
//if no valid token user gets a 401 error
//if valid token, req.user is populated with user info

//async(req,res) = the actual handler function
//req = what the client sends
//res = what we send back
//async = function uses database (takes time)
router.post('/', verifyToken, async (req, res) => {
    try{
        //Client sends json like { "category_id": "xyz", "amount": 50, "type": "expense",...}
        //we extract those values from the request body 
        const { category_id, amount, type, description, date} = req.body;

        //It set req.user = decoded sp we get the logged in user id from the token
        const user_id = req.user.id;

        //Validate input
        //checks if all required fields exist
        //return stop execution
        if(!category_id || !amount || !type || !date) {
            return res.status(400).json({error: 'Missing required fields'});
        }

        //Insert INTO transaction
        const result = await pool.query(
            //add a new row
            //values ($1, $2, $3, $4, $5, $6) = placeholder values
            //[user_id, category_id,...] = actual values (prevent SQL injection)
            //Returning * = send back the created transactions
            'INSERT INTO transactions (user_id, category_id, amount, type, description, date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [user_id, category_id, amount, type, description, date]
        );

        res.status(201).json({
            message: 'Transaction created',
            transaction: result.rows[0]
        });
    }catch (err) {
        console.error('create transaction error:', err);
        res.status(500).json({error: 'Failed to create transaction', details: err.message});
    }
});

//READ - Get all user's transactions
// router.get('/') = listening for GET requests (not POST)
// req.query instead of req.body
    // GET requests send data in url: /api/transactions?category_id...
    //req.query extracts those paramteters
router.get('/', verifyToken, async (req, res) => {
    try{
        const user_id = req.user.id;
        const {category_id, start_date, end_date} = req.query;

        //Get all transactions for this user
        //if user provided category_id in URL, add filter: AND category_id=...
        let query = 'SELECT * FROM transactions WHERE user_id = $1';
        let params = [user_id];

        //Filter by category if provided
        //if user provided category_id in the URL, add filter and Category_id
        // EXAMPLE
        // if no filters: SELECT * FROM transactions WHERE user_id = 'user123'
        //if category filter: SELECT * FROM transactions WHERE user_id = 'user123' AND category_id = 'food'
        if(category_id) {
            query += ' AND category_id = $2';
            params.push(category_id);
        }

        //Filter by date range if provided
        if (start_date && end_date) {
            query += ` AND date BETWEEN $${params.length + 1} AND $${params.length + 2}`;
            params.push(start_date, end_date);
        }

        query+= ' ORDER BY date DESC';

        const result = await pool.query(query, params);

        res.json({
            count: result.rows.length,
            transactions: result.rows
        });
    } catch(err) {
        console.error('Get transactions error:', err);
        res.status(500).json({error: 'Failed to fetch transactions', details: err.message});
    }
});

//READ - Get single transaction 
//Whats different: 
    //router.get('/:id') = listening for GET to api/transactions/123
    //:id = dynamic parameter (could be any ID)
    //Example: /api/transactions/abc-def-ghi -> id = "abc-def-ghi"
//req.params = URL parameters
    //req.params.id = the ID from the URL
    //we use destructuring: const { id } = req.params;
router.get('/:id', verifyToken, async(req,res) => {
    try{
        const {id} = req.params;
        const user_id = req.user.id;

        //Get transaction with this ID
        //BUT ALSO check AND user_id = $2
        //WHY? so user can only see their ow transactions
        //Example: User A cant view Users B transactions
        const result = await pool.query(
            'SELECT * FROM transactions WHERE id = $1 AND user_id = $2',
            [id, user_id]
        );

        //if no transaction found -> return 404 
        //if found -> return transaction
        if(result.rows.length === 0){
            return res.status(404).json({error : 'Transaction not found'});
        }

        res.json({transaction: result.rows[0]});
    }catch (err) {
        console.error('Get transaction error:', err);
        res.status(500).json({error: 'Failed to fetch transaction', details: err.message});
    }
});


//UPDATE - Edit transactions
router.put('/:id', verifyToken, async (req, res) => {
    try{
        const {id} = req.params;
        const user_id = req.user.id;
        const {category_id, amount, type, description, date} = req.body;

        //Check if transaction exists and belongs to user
        const checkResult = await pool.query(
            'SELECT * FROM transactions WHERE id = $1 AND user_id = $2',
            [id, user_id]
        );

        if(checkResult.rows.length === 0){
            return res.status(404).json({error: 'Transaction not found'});
        }

    //Update transaction
    const result = await pool.query(
        'UPDATE transactions SET category_id = $1, amount = $2 , type = $3, description = $4, date = $5, updated_at = NOW() WHERE id = $6 AND user_id = $7 RETURNING *',
        [category_id, amount, type, description, date, id, user_id]
    );

    res.json({
        message: 'Transaction updated',
        transaction: result.rows[0]
    });

}catch (err){
    console.error('Update transaction error:', err);
    res.status(500).json({error: 'Failed to update transaction', details: err.message});
    }
});

//DELETE - Remove transaction
//router.delete('/:id') = listening for DELETE request to /api/transactions/123
//Same pattern as READ ONE and UPDATE
//Get ID from URL and user ID from token
router.delete('/:id', verifyToken, async(req,res) =>{
    try{
        const {id} = req.params;
        const user_id = req.user.id;

        //Check if transaction exists and belongs to user
        const checkResult = await pool.query(
            'SELECT * FROM transactions WHERE id = $1 AND user_id = $2',
            [id, user_id]
        );

        if(checkResult.rows.length === 0){
            return res.status(404).json({ error: 'Transaction not found'});
        }

        //Delete transaction
        await pool.query(
            'DELETE FROM transactions WHERE id = $1 AND user_id = $2',
            [id, user_id]
        );

        res.json({message: 'Transaction deleted successfully'});

    }catch(err){
        console.error('Delete transaction error:', err);
        res.status(500).json({error: 'Failed to delete transaction', details: err.message});
    }
});

module.exports = router;

