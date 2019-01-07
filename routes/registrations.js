const router = require('express').Router();
const User = require('../models/user');

// Show registration form
router.get('/new', function(req, res, next) {
  res.render('registrations/new', { user: new User() });
});

// Create a new user
router.post('/', async function(req, res, next) {
  const user = new User(req.body);
  try {
    await user.save();
  }
  catch (err) {
    console.log(err);
    return res.render('registrations/new', { user: user });
  }

  req.login(user, function(err) {
    if (err) return next(err);
    res.redirect('/');
  });
  
});

module.exports = router;
