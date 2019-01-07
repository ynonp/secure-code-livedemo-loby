var passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');

passport.use(new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password',
    },
    function (email, password, done) {
        User.findOne({ email }, function (err, user) {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, { message: 'Invalid email/password' });
            }
            user.checkPassword(password).then(function (valid) {
                if (!valid) {
                    return done(null, false, { message: 'Invalid email/password' });
                }
              console.log(`User logged in ${user.email}`);
                return done(null, user);
            });
        });
    }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

