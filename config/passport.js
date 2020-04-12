const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const User = require('../models/userschema');

module.exports = function(passport){
    passport.use(
        new LocalStrategy({usernameField: 'email'}, (email, password, done) =>{
            User.findOne({email : email})
            .then( user=> {
                if(!user)
                {
                    return done(null, false, {message: 'User with this email doesnot exists'});
                }
                if(user.confirmed)
                {
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if(err) throw err;
                    if(isMatch){
                        return done(null, user);
                    }
                    else{
                        return done(null, false, {message: 'Incorrect password'});
                    }
                });
            }
            else{
                return done(null,false, {message: 'Please verify your account'});
            }
            });
        })
    );
    passport.serializeUser(function(user,done){
        done(null, user.id);
    });
    passport.deserializeUser(function(id, done){
        User.findById(id, function(err, user){
            done(err,user);
        });
    });
} 