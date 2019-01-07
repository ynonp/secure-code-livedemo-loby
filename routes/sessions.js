const router = require('express').Router();
const passport = require('passport');

// Show login form
router.get('/new', function(req, res, next) {
  res.render('sessions/new');
});

// Sign in
router.post('/',
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/sessions',
        failureFlash: false
    })
);

// Sign out
router.get('/logout', function(req, res, next) {
    req.logout();
    res.redirect('/');
});

module.exports = router;
