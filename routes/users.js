const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

var RegisterSchema = require('../models/userschema');
var tokenSchema = require('../models/emailtoken');
const {ensureAuthenticated} = require('../config/auth');



/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('index.ejs');
});

router.get('/login',function(req,res,next){
  res.render('login.ejs');
});

router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You have been successfully logged out');
  res.redirect('/users/login');
});

router.get('/signup', function(req,res){
  res.render('signup.ejs');
});

router.post('/login', async (req,res, next) => {
  passport.authenticate('local',{
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req,res, next);
});
router.post('/signup', async function(req,res){
  let errors = [];
  const hashPasswd = await bcrypt.hash(req.body.psw,10);
  const {fname, lname, email, organisation, mobile, psw, psw_repeat} = req.body;
  console.log(req.body);
  if(!fname || !lname || !email || !organisation || !mobile)
  {
    errors.push({
      msg: 'Please fill in all fields'
    });
  }
  if(psw != psw_repeat)
  {
    errors.push({
      msg: 'Password should match'
    });
  }
  if(psw.length < 8)
  {
    errors.push({
      msg: 'Password length should be greater than 8'
    });
  }
  if(errors.length > 0)
  {
    res.render('signup.ejs',{
      errors
    });
  }
  else
  {
    RegisterSchema.findOne({ email : req.body.email})
      .then(user => {
        console.log("User found details");
        console.log(user);
        if(user)
        {
          errors.push({
            msg: 'User already exists, Please login'
          });
          res.render('logout.ejs',{
            errors
          });
          res.end();
        }
        else
        {

          var passwd = req.body.psw;
          try {
              console.log(hashPasswd);
              var registerschema = new RegisterSchema({
                firstname: req.body.fname,
                lastname: req.body.lname,
                email: req.body.email,
                organisation: req.body.organisation,
                mobile: req.body.mobile,
                password: hashPasswd
                });
                registerschema.save(function(err, user){
                  if(err) throw err;
                  req.flash('success_msg', 'You are now registered, Please verify your email');
                  console.log(user);
                });
              } catch (error) {
                res.end();
              }
              var token = new tokenSchema({ 
                _userId: registerschema._id, 
                token: crypto.randomBytes(16).toString('hex') 
              })
              token.save(function(err, user){
                if(err) throw err;
                console.log(user);
                console.log("Email token saved successfully");
                var transporter = nodemailer.createTransport({ service: 'Gmail', auth: { user: 'prakashj1998@gmail.com', pass: 'TeenuAjay.123' } });
                var mailOptions = { from: 'prakashj1998@gmail.com', to: registerschema.email, subject: 'Account Verification Token', text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/'+'localhost:8000'+'\/users\/'+'confirmation\/' + token.token +'\/'+token._userId+ '.\n' };
                transporter.sendMail(mailOptions, function (err) {
                if (err) { return res.status(500).send({ msg: err.message }); }
                res.status(200).send('A verification email has been sent to ' + user.email + '.');
              });
              });

            }
      });
  }
  res.render('index.ejs',{success_message: 'You have successfuly registered'});
});


router.get('/confirmation/:token/:id',function(req, res, next){
  console.log("Tokennnnnn");
  console.log(req.params.token);
  console.log("_userIdddd");
  console.log(req.params.id);
  tokenSchema.findOne({token: req.params.token}, function(err, token){
    if(!token)
    {
      req.flash('error_msg', 'Unable to find a valid token, your token may be expired');
      res.render('resendToke.ejs');
      res.end();
    }
    else{
        RegisterSchema.findOne({_id: req.params.id})
        .then(userDetails =>{
          if(!userDetails)
          {
            console.log("No User Found");
          }
          else{

        RegisterSchema.findOne({_id: userDetails._id, email: userDetails.email})
      .then(user =>{
        if(user.confirmed)
        {
          req.flash('success_msg', 'User is already confirmed, Please login to continue');
          res.render('login.ejs');
          res.end();
        }
        else{
          user.confirmed = true;
          user.save(function(err){
            if(err) throw err;
            console.log("User has been successfully verified, please login to continue");
            res.render('login.ejs');
            res.end();
          });
        }
      });
    }
    });
    }
  });
});

router.post('/resendtoken', function(req, res){
  RegisterSchema.findOne({email: req.body.email})
  .then(UserDetails =>{
      if(!UserDetails)
      {
        console.log("No user found");
        res.redirect('/users/signup');
      }
      else{
        var token = new tokenSchema({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });
        token.save(function(err){
            if(err) throw err;
            var transporter = nodemailer.createTransport({ service: 'Sendgrid', auth: { user: 'prakashj1998@gmail.com', pass: 'TeenuAjay.123' } });
            var mailOptions = { from: 'prakashj1998@gmail.com', to: registerschema.email, subject: 'Account Verification Token', text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/'+'localhost:8000'+'\/users\/'+'confirmation\/' + token.token +'\/'+token._userId+ '.\n' };
            transporter.sendMail(mailOptions, function (err) {
            if (err) { return res.status(500).send({ msg: err.message }); }
                res.status(200).send('A verification email has been sent to ' + user.email + '.');
            });
        });
      }
  });
});

module.exports = router;
