const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');

const router = express.Router();

//SIGNUP - Create new user
router.post('/signup', async(req,res) => {
    try{
        const {email, password, first_name, last_name} = req.body;

        //Validate input
        if(!email || !password) {
            return res.status(400).json({error: 'Email and password required'});
        }

        //check if user already exists
        const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if(userExists.rows.length > 0){
            return res.status(400).json({error: 'User already exists'});
        }

        //Hash password
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password,salt);

        //Create user
        const result = await pool.query(
            'INSERT INTO users (email, password_hash , first_name, last_name) VALUES ($1, $2, $3, $4) RETURNING id, email, first_name, last_name',
            [email, password_hash, first_name, last_name]
        );

        const user = result.rows[0];

        //Generate JWT token
        const token = jwt.sign({ id: user.id, email: user.email}, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE
        });

        res.status(201).json({
            message: 'User created successfully',
            user,
            token
        });
    } catch(err) {
        console.error('Signup error:', err);
        res.status(500).json({error: 'Signup failed', details: err.message});
    }
});

//LOGIN - Authenticate user
router.post('/login', async (req,res) => {
    try{
        const {email, password} = req.body;

        //Validate input
        if (!email || !password) {
            return res.status(400).json({error: 'Email and password required'});
        }

        //Find user
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status (401).json({error: 'Invalid email or password'});
        }

        const user = result.rows[0];

        //Compare passwords
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if(!isMatch){
            return res.status(401).json({ error: 'Invalid email or password'});
        }

        //Generate JWT token
        const token = jwt.sign({id: user.id , email: user.email}, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE
        });
        
        res.json({
            message: 'Login succcessul', 
            user: { 
                id: user.id, 
                email: user.email, 
                first_name: user.first_name, 
                last_name: user.last_name
            },
            token
        });
    } catch (err){
        console.error('Login error:', err);
        res.status(500).json({error: 'Login failed', details: err.message});
    }
});

module.exports = router;