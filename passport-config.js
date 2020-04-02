const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt');
var mysql= require('mysql');
var con = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "",
            database:"User"
          });

function initialize(passport, getUserByEmail, getUserById) {
  const authenticateUser = async (email, password, done) => {
    const user = getUserByEmail(email)
    console.log("User Detailsssssssssssssssss");
    console.log(user.email);
    con.connect(function(err) {
        // if (err) throw err;
        con.query("SELECT * FROM login WHERE email = '" + user.email +"'",async function (err, result) {
        //   if (err) throw err;
          console.log("Result detailsssssss");
          console.log(result);
          if (result == null){
              return done(null, false, {message: 'No user with that email'});
          }
          else{
            try {
              console.log(user.password);
                // var passwd = await bcrypt.hash(user.password, 10);
                // console.log(passwd);
                console.log(result[0].password);
                console.log(user.password);
                if(await bcrypt.compare(user.password,result[0].password)){
                    return done(null, user);
                }
                else{
                    return done(null, false, {message: 'Password incorrect'});
                }
            } catch (e) {
                return done (e);
            }
          }
        });
      });
  }

  passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))
//   passport.serializeUser((user, done) => done(null, user.id))
//   passport.deserializeUser((id, done) => {
//     return done(null, getUserById(id))
//   })
passport.serializeUser(function(user, done) {
    done(null, user);
  });
  passport.deserializeUser(function(user, done) {
    done(null, user);
  });
}

module.exports = initialize
