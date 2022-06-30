const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const request = require('request');
// User model
const User = require('../models/User');

//env variables
require('dotenv').config();


// Login Page
router.get('/login',(req, res)=>{
    res.render('login')
});

// Register Page
router.get('/register',(req, res)=>{
    res.render('register')
});

// Forgot Password Page
router.get('/forgotpass',(req, res)=>{
    res.render('forgotpass')
});

// Change Password Page
router.get('/changepass/:id',(req, res)=>{
    res.render('Changepass',{
        id: req.params.id
    });
});

// Sent email Page
router.get('/sentEmail',(req, res)=>{
    res.render('sentEmail')
});

// Register Handle
// Register handle
router.post('/register',(req,res)=>{
    const {firstName, lastName, email, password, password2} = req.body;
    let errors = [];

    // Check required fields
    if(!firstName || !lastName || !email || !password || !password2)
        errors.push({msg:'Please fill in all fields'});
    // Check passwords match
    if(password !== password2)
        errors.push({msg:'Password do not match'});
    // Check password length
    if(password.length < 6)
        errors.push({msg:'Password should be at least 6 characters'});

    if(errors.length > 0){
        res.render('register',{
            errors,
            firstName,
            lastName,
            email,
            password,
            password2
        });
    }else{
        // Validation passed
        User.findOne({email:email})
        .then(user =>{
            if(user){
                // User exist
                errors.push({msg:'Email is already registered'});
                res.render('register',{
                    errors,
                    firstName,
                    lastName,
                    email,
                    password,
                    password2
                });
            }else{
                const newUser = new User({
                    firstName,
                    lastName,
                    email,
                    password
                });

                // Hash Password
                bcrypt.genSalt(10, (err, salt)=> 
                bcrypt.hash(newUser.password, salt, (err, hash)=>{
                    if(err) throw err;
                    // Set password to hashed
                    newUser.password = hash;
                    // Save user
                    newUser.save()
                    .then(user => {
                        req.flash('success_msg', 'You are now registered');
                        res.redirect('/users/login');
                    })
                    .catch(err => console.log(err));
                }));
            }
        })
        .catch();
    }
});


// verified page
router.get('/verified',(req,res)=>{
    res.render('verified');
});

// Login Handle
router.post('/login',async(req, res, next)=>{
    const {email, password} = req.body;
    
    let errors = [];

    
    //Check required fields
    if(!email || !password){
        errors.push({msg:'Please fill in all fields'});
    }

    if(errors.length > 0){
        res.render('login',{
                    errors,
                    email,
                    password,
                });
    }else {

        passport.authenticate('local', {
            successRedirect: '/dashboard',
            failureRedirect: '/users/login',
            failureFlash: true
        })(req, res, next);     
    } 
});

// Logout Handle
router.post('/logout',(req, res, next)=>{
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
});

module.exports = router;