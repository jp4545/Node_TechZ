// if(process.env.NODE_ENV !== 'production')
// {
//   require('dotenv').config();
// }

const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const myParser = require('body-parser');
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');

const initializePassport = require('../passport-config')
initializePassport(
  passport,
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
)

var users = [];
router.use(myParser.urlencoded({extended : false}));
router.use(flash());
router.use(session({
  secret: 'Jpppp',
  resave: false,
  saveUninitialized: false
}));
router.use(passport.initialize());
router.use(passport.session());

/* GET home page. */
router.get('/',checkAuthenticated, function(req, res) {
  res.render('index.ejs');
});
router.get('/logout',checkAuthenticated, function(req, res) {
  res.render('logout.ejs',{name: req.user.email});
});
router.get('/login',checkNotAuthenticated, function(req,res){
  users = [];
  res.render('login.ejs');
});
router.post('/login',checkNotAuthenticated, async (req,res) => {
  var hashpasswd = await bcrypt.hash(req.body.password,10);
  users.push({
    email: req.body.email,
    password: req.body.password
  });
  passport.authenticate('local',{
    successRedirect: '/logout',
    failureRedirect: '/login',
    failureFlash: true
  })(req,res);
});
router.post('/signup',checkNotAuthenticated, async function(req,res){
  var fname = req.body.fname;
  var lname = req.body.lname;
  var email = req.body.email;
  var org = req.body.organisation;
  var mobile = req.body.mobile;
  var passwd = req.body.psw;
  var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database:"User"
  });
  var jp = "Jaya Prakash";
  var truncate_query = "TRUNCATE TABLE login";
  var selQuery = "SELECT * from login";
  var sql_query = "INSERT into login (fname,lname,email,mobile,org,password) VALUES ?";
  var sel_query = "SELECT * FROM login WHERE fname = 'Jaya Prakash'";
  try {
    const hashPasswd = await bcrypt.hash(passwd,10);
    console.log(hashPasswd);
    // users.push({
    //   email: email,
    //   password: hashPasswd
    // });
    var values = [
      [fname,lname,email,mobile,org,hashPasswd]
    ];
    con.query(sql_query, [values], function (err, result) {
      if (err) throw err;
      console.log("Number of records inserted: " + result.affectedRows);
      console.log("Jppppppppp Detailsssss");
      console.log(result[0].email);
    });
  } catch (error) {
    res.end();
  }


  // con.connect(function(err) {
  //   if (err) throw err;
  //   console.log("Connected!");
  //   con.query("INSERT into login (fname,lname,email,mobile,org,password,pwdrpt) values(fname,lname,email,mobile,org,'abc','abc')", function (err, result) {
  //     if (err) throw err;
  //     console.log("Inserted Successfully");
  //     console.log(result);
  //   });
  // });
  res.render('login.ejs');
});

router.delete('/logout', (req, res) => {
  req.logOut()
  res.redirect('/login')
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  next()
}
module.exports = router;
